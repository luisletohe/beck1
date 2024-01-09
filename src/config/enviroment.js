import dotenv from 'dotenv';

let path = '.env.dev';

dotenv.config({ path })

export default { 
    DB_LINK: process.env.DB_LINK,
    PORT: process.env.PORT,
    DB_LINK_CREATE: process.env.DB_LINK_CREATE,
    PERSISTENCE: process.env.PERSISTENCE,
    KEYJWT: process.env.KEYJWT,
    CLIENTSECRET: process.env.CLIENTSECRET,
    CLIENTID: process.env.CLIENTID,
    NODE_ENV: process.env.NODE_ENV,
    NODMAILER_SERVICE: process.env.NODMAILER_SERVICE,
    NODMAILER_USER: process.env.NODMAILER_USER,
    NODMAILER_PASS: process.env.NODMAILER_PASS,
    DB_SECRET: process.env.DB_SECRET,
    EMAIL_ADMIN: process.env.EMAIL_ADMIN,
    JWT_SECRET: process.env.JWT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL
};