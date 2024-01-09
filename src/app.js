import mongoose from 'mongoose';
import express from 'express';
import { server, app } from './utils/socket.js';
import handlerbars from 'express-handlebars';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import session from 'express-session';
import passport from 'passport';
import { productRouter } from './routes/products.router.js';
import { cartRouter } from './routes/carts.router.js';
import wiewsRouter from './routes/views.router.js';
import { userRouter } from './routes/user.router.js';
import { ticketRouter } from './routes/ticket.router.js';
import inicializePassport from './config/passport.config.js';
import enviroment from './config/enviroment.js';
import errorsManagerMiddleware from './middleware/errorsManager.middleware.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { loggerMiddleware } from './middleware/logger.middleware.js';
import { chatRouser } from './routes/chat.router.js';


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware)
app.use(express.static('public'))
app.use(cookieParser())

app.engine('handlebars', handlerbars.engine());
app.set('views', 'views/');
app.set('view engine', 'handlebars');

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: enviroment.DB_LINK_CREATE,
      mongoOptions: {
        useNewUrlParser: true,
      },
      ttl: 6000,
    }),
    secret: enviroment.DB_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
inicializePassport()

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect(
  enviroment.DB_LINK
);


const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Vip Api',
      version: '1.0.0',
      description: 'Tienda online de caballero'
    }
  },
  apis: ['./docs/**/*.yaml']
}
const spects = swaggerJSDoc(swaggerOptions)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spects))
app.use('/', wiewsRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/users', userRouter);
app.use('/api/chat', chatRouser)
app.use('/api/purchase', ticketRouter);


app.use(errorsManagerMiddleware)

const httpServer = enviroment.PORT;
server.listen(httpServer, () => console.log(`estoy escuchando ${httpServer}...`));

