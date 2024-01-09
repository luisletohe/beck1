import { Router } from "express";
import { isAuth } from "../middleware/auth.middleware.js";
import { menssagerModel } from "../models/menssage.model.js";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import { io } from "../utils/socket.js";

 
const chatRouser = Router()


chatRouser.post('/', middlewarePassportJwt , isAuth , async (req, res, next) => {

    try {

        const { user, menssage } = req.body;
        const newMessage = new menssagerModel({ user, menssage });
        await newMessage.save();

        const messages = await menssagerModel.find({}).lean();

        io.emit('List-Message', {
            messages: messages

        })

        res.redirect('/chat');
    } catch (err) {
        res.redirect('/errorcaduco');
    }
});

export { chatRouser }