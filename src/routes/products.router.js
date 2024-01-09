import { Router } from "express";
import { io } from "../utils/socket.js";
import { productList } from "../utils/instances.js";
import productController from "../controllers/product.controller.js";
import ErrorCodes from "../utils/error.js";
import CustomErrors from "../utils/customError.js";
import { generateErrorProduct } from "../utils/info.js";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import { checkAuthorization } from "../middleware/auth.middleware.js";
import userController from "../controllers/user.controller.js";
import { transporter } from "../utils/nodemailer.js";

const productRouter = Router();

productRouter.get('/', async (req, res, next) => {

  const { limit = 20, page = 1, sort, descripcion, availability } = req.query;
  try {
    const products = await productController.getProducts(
      limit,
      page,
      sort,
      descripcion,
      availability
    );

    const prevPage = products.prevPage;
    const nextPage = products.nextPage;

    const prevLink =
      prevPage &&
      `${req.baseUrl}/?page=${prevPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;

    const nextLink =
      nextPage &&
      `${req.baseUrl}/?page=${nextPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;

    res.status(201).json({
      status: "success",
      payload: products.docs,
      totalPages: products.totalPages,
      page: products.page,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: prevLink,
      nextLink: nextLink,
    });
  } catch (err) {
    next(err)
    res.status(400).send(err)
  }
});


productRouter.get('/:uid', async (req, res, next) => {
  try {
    let uid = req.params.uid
    const filterId = await productController.getProductsById(uid)
    res.status(201).send(filterId)
  } catch (err) {
    next(err)
    res.status(400).send(err)
  }
});


productRouter.post('/', async (req, res, next) => {
  try {
    let product = req.body;
    let productos = await productController.addProducts(product);

    res.redirect('/addproduct')
  } catch (err) {
    next(err)
    res.status(500).send(err)
  }
});



//, middlewarePassportJwt, checkAuthorization //  con los middleware de autorizacion no puedo usar swagger
productRouter.put('/:uid', middlewarePassportJwt, checkAuthorization, async (req, res, next) => {
  const uid = req.params.uid;
  try {
    const productActualizado = await productController.updateProduct(uid, req.body)
    res.status(201).send(productActualizado)
  } catch (err) {
    next(err)
    res.status(400).send(err)
  }
})
//, middlewarePassportJwt, checkAuthorization  //  con los middleware de autorizacion no puedo usar swagger
productRouter.delete('/:uid', middlewarePassportJwt, checkAuthorization, async (req, res, next) => {

  try {

    const id = req.params.uid
    const getOwnerProduct = await productController.getProductsById(id)
    const emailPremiun = getOwnerProduct[0].owner
    const user = await userController.getByEmail(emailPremiun)

    if (user) {

      if (user.rol === 'PREMIUM') {
        const emailOptions = {
          from: `NOTIFICACION VIP <mitchel2206@gmail.com>`,
          to: `${user.email}`,
          subject: 'Han eliminado un producto de tu tienda VIP',
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">
               <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
                 <div style="text-align: center; padding: 20px 0;">
                 <h1 style="color: #333;"> ${user.first_name}, el administrador a eliminado un producto de tu tienda</h1>
                 <img class="logo" src="https://i.postimg.cc/pL1mYXqM/VIP-fotor-bg-remover-20230624162050.png"
               </div>
               <div style="padding: 20px;">
                  <p style="margin-bottom: 20px; font-size: 16px; color: #333;"> Descripcion del producto: ${getOwnerProduct[0].descripcion}, ID: ${getOwnerProduct[0]._id} </p>
                   <p style="font-size: 14px; color: #777;">Si no eres usuario, puedes ignorar este correo electrónico.</p>
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


      }

      const deleteProduct = await productController.deleteProduct(id)
      req.logger.info(`se logro eliminar el pid ${id} del base de dato`)
      res.status(201).send(deleteProduct)


    } else {
      const deleteProduct = await productController.deleteProduct(id)
      req.logger.info(`se logro eliminar el pid ${id} del base de dato`)
      res.status(201).send(deleteProduct)
    }


  } catch (err) {
    next(err)
    res.status(500).send(err)
  }
})


export { productRouter };