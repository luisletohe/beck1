import nodmailer from 'nodemailer'
import enviroment from '../config/enviroment.js'


export const transporter = nodmailer.createTransport({
    service: enviroment.NODMAILER_SERVICE,
    port: 465,
    auth: {
        user: enviroment.NODMAILER_USER,
        pass: enviroment.NODMAILER_PASS,
    },
})