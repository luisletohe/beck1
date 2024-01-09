import { Router } from "express";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import cartController from "../controllers/cart.controller.js";
import ticketController from "../controllers/ticket.controller.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";
import { transporter } from "../utils/nodemailer.js";



const ticketRouter = Router()

ticketRouter.post('/:id', middlewarePassportJwt, async (req, res, next) => {
  try {
    const user = req.user;
    const client = await userModel.findById(user._id);
    const cartClient = await cartController.getCartId(req.params.id);

    client.cart.push(cartClient);
    await client.save();

    const productsToUpdate = cartClient.products.map(item => {
      return {
        productId: item.product._id,
        quantity: item.quantity
      };
    });

    const updateOperations = productsToUpdate.map(item => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stock: -item.quantity } }
      }
    }));

    await productModel.bulkWrite(updateOperations);

    const total = cartClient.products.reduce((acc, product) => acc + product.product.price * product.quantity, 0);
    const purchase_datatime = new Date().toLocaleString();
    const generatedCode = Math.floor(Math.random() * 90000) + 10000;

    const createTicket = await ticketController.createTicket({
      code: generatedCode,
      purchase_datatime,
      amount: total,
      purchaser: user.email,
    });



    const emailOptions = {
      from: `COMPROBANTE DE COMPRA ( VIP ) <mitchel2206@gmail.com>`,
      to: `${client.email}`,
      subject: `Ticket N. ${createTicket.code} `,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">
           <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
             <div style="text-align: center; padding: 20px 0;">
             <h1 style="color: #333;"> Ticket N. ${createTicket.code} </h1>
             <img class="logo" src="https://i.postimg.cc/pL1mYXqM/VIP-fotor-bg-remover-20230624162050.png"
           </div>
           <div style="padding: 20px;">
               
               <p style="margin-bottom: 20px; font-size: 16px; color: #333;">PAGO DEBITADO DE $${createTicket.amount}</p>
               <p style="margin-bottom: 20px; font-size: 16px; color: #333;"> GRACIAS POR TU COMPRA!</p>
               <p style="font-size: 14px; color: #777;">Tu compra fue registrada el dia  ${createTicket.purchase_datatime}, y sera enviada en un plazo de 48HS </p>
             </div>
           </div>
        </div>`,
      attachments: [],
    };

    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        req.logger.error(error)
      }
      req.logger.info('Email sent: ' + info)
    })

    return res.status(201).send(createTicket);
  } catch (err) {
    next(err)
    req.logger.error(`Error al generar el ticket`);
    return res.status(500).send(err);
  }
});



ticketRouter.get('/', async (req, res) => {
  const tickets = await ticketController.getTicket()
  res.status(200).send(tickets)
})


export { ticketRouter }