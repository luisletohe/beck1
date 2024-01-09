import { Router } from "express";
import productController from "../controllers/product.controller.js";
import { middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import userController from "../controllers/user.controller.js";
import UsersAdminDTO from "../dto/adminUsers.js";



const wiewsRouter = Router()


wiewsRouter.get('/profile', middlewarePassportJwt, async (req, res) => {
  const user = req.user
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionAdmin = user.rol === "ADMIN";
  const autorizacionUsPr = user.rol === "PREMIUM" || user.rol === "USER";

  res.render('profile', {
    title: 'Perfil de Usuario',
    message: 'Private route',
    autorizacionAdmin,
    user,
    autorizacion,
    autorizacionUsPr
  });
});

wiewsRouter.get('/', (req, res) => {
  res.render('register', {
    title: 'Registrar Nuevo Usuario',
  });
});


wiewsRouter.get('/login', (req, res) => {
  res.render('login', {
    title: 'Inicio de Sesión',
  });
});

wiewsRouter.get('/dataerror', (req, res) => {
  res.render('dataerror', {
    title: 'Error en en datos ingresados',
  });
});

wiewsRouter.get('/errorexistsuser', (req, res) => {
  res.render('errorexistsuser', {
    title: 'EL usuario ya existe',
  });
});


wiewsRouter.get('/errorservidor', (req, res) => {
  res.render('errorservidor', {
    title: 'Error del servidor',
  });
});

wiewsRouter.get('/errorcaduco', (req, res) => {
  res.render('errorcaduco', {
    title: 'token jwt expired',
  });
});


wiewsRouter.get('/forgotpassword/:token', (req, res) => {
  const token = req.params;
  res.render('forgotpassword', {
    title: 'Olvido contrasena',
    token: token.token
  });
});


wiewsRouter.get('/emailsent', (req, res) => {
  res.render('emailsent', {
    title: 'Se envio email de restablecimiento',
  });
});

wiewsRouter.get('/restpassword', (req, res) => {
  res.render('restpassword', {
    title: 'restablecer contrasena',
  });
});

wiewsRouter.get('/errorpassword', (req, res) => {
  res.render('errorpassword', {
    title: 'Error de password',
  });
});

wiewsRouter.get('/faltadearchivos', middlewarePassportJwt, (req, res) => {
  const user = req.user;
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionUsPr = user.rol === "PREMIUM" || user.rol === "USER";
  const autorizacionAdmin = user.rol === "ADMIN";
  res.render('faltadearchivos', {
    title: 'falta de archivos',
    autorizacion,
    user,
    autorizacionAdmin,
    autorizacionUsPr
  });
});

wiewsRouter.get('/documents', middlewarePassportJwt, async (req, res) => {
  const user = req.user;
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionAdmin = user.rol === "ADMIN";
  res.render('documents', {
    title: 'Carga de archivos',
    user,
    autorizacion,
    autorizacionAdmin
  });
});

wiewsRouter.get('/archivoenviado', middlewarePassportJwt, (req, res) => {
  const user = req.user;
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionUsPr = user.rol === "PREMIUM" || user.rol === "USER";
  const autorizacionAdmin = user.rol === "ADMIN";
  res.render('archivoenviado', {
    title: 'Archivo enviado',
    autorizacion,
    user,
    autorizacionAdmin,
    autorizacionUsPr
  });
});

wiewsRouter.get('/fileuser', middlewarePassportJwt, async (req, res) => {
  const user = req.user;
  const userid = user._id
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionAdmin = user.rol === "ADMIN";
  const autorizacionUsPr = user.rol === "PREMIUM" || user.rol === "USER";

  const liveDocumentsUser = await userController.getUserById(userid)
  const identification = liveDocumentsUser.documents;
  const addressProof = liveDocumentsUser.documents;
  const bankStatement = liveDocumentsUser.documents;

  res.render('fileuser', {
    title: 'Subir archivos del usuario',
    user,
    autorizacion,
    identification,
    addressProof,
    bankStatement,
    autorizacionAdmin,
    autorizacionUsPr
  });
});


wiewsRouter.get('/falsedocuments', middlewarePassportJwt, async (req, res) => {
  const user = req.user;
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionAdmin = user.rol === "ADMIN";
  res.render('falsedocuments', {
    title: 'error de cambio de rol',
    user,
    autorizacion,
    autorizacionAdmin
  });
});



wiewsRouter.get('/addproduct', middlewarePassportJwt, async (req, res) => {
  const user = req.user;
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionAdmin = user.rol === "ADMIN";

  res.render('addproduct', {
    title: 'Agregar un producto a la aplicacion',
    user,
    autorizacion,
    autorizacionAdmin
  });
});

wiewsRouter.get('/controlleruser', middlewarePassportJwt, async (req, res) => {
  const user = req.user;
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";

  const autorizacionAdmin = user.rol === "ADMIN";
  const usuarios = await userController.getAll()
  const dto = new UsersAdminDTO(usuarios);
  const usersAdmin = dto.usuarios

  res.render('controlleruser', {
    title: 'controlador de usuarios del administrador',
    usersAdmin,
    autorizacion,
    user,
    autorizacionAdmin
  });
});



wiewsRouter.get('/index', middlewarePassportJwt, async (req, res) => {
  const { limit = 4, page = 1, sort, descripcion, availability } = req.query;
  const user = req.user
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionAdmin = user.rol === "ADMIN";
  const autorizacionUsPr = user.rol === "PREMIUM" || user.rol === "USER";

  try {
    // const products = generateProducts(page, limit, sort, descripcion, availability)

    const result = await productController.getProducts(limit, page, sort, descripcion, availability);
    const pag = result.pag;
    const prevPage = result.prevPage;
    const nextPage = result.nextPage;
    const totalPages = result.totalPages;



    const prevLink =
      prevPage &&
      `${req.baseUrl}/index/?page=${prevPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;


    const nextLink =
      nextPage &&
      `${req.baseUrl}/index/?page=${nextPage}&limit=${limit}&sort=${sort || ""
      }&descripcion=${encodeURIComponent(descripcion || "")}${availability ? `&availability=${availability}` : ""
      }`;


    const products = result.docs.map((product) => product.toObject());

    res.render("index", {
      title: "Products",
      products,
      pag,
      prevLink,
      totalPages,
      nextLink,
      user,
      autorizacionAdmin,
      autorizacion,
      autorizacionUsPr
    });
  } catch (error) {
    req.logger.error(`No se obtuvieron los productos de la base de dato`)
    res.status(500).send(`No se pudieron obtener los productos`);
  }
});


wiewsRouter.get('/chat', middlewarePassportJwt, (req, res) => {
  const user = req.user
  const autorizacionAdmin = user.rol === "ADMIN";
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionUsPr = user.rol === "PREMIUM" || user.rol === "USER";
  res.render('chat', { user, autorizacion, autorizacionAdmin, autorizacionUsPr });
});


wiewsRouter.get('/carts/', middlewarePassportJwt, async (req, res) => {
  const user = req.user
  const autorizacionAdmin = user.rol === "ADMIN";
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionUsPr = user.rol === "PREMIUM" || user.rol === "USER";
  res.render('cart', { user, autorizacion, autorizacionAdmin, autorizacionUsPr });
});


wiewsRouter.get('/changeofrole/', middlewarePassportJwt, async (req, res) => {
  const user = req.user
  const autorizacionAdmin = user.rol === "ADMIN";
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionUsPr = user.rol === "PREMIUM" || user.rol === "USER";
  res.render('changeofrole', { user, autorizacion, autorizacionAdmin, autorizacionUsPr });
});

wiewsRouter.get('/myshop/', middlewarePassportJwt, async (req, res) => {
  const user = req.user
  const autorizacionAdmin = user.rol === "ADMIN";
  const autorizacion = user.rol === "PREMIUM" || user.rol === "ADMIN";
  const autorizacionUsPr = user.rol === "PREMIUM" || user.rol === "USER";
  res.render('myshop', { user, autorizacion, autorizacionAdmin, autorizacionUsPr });
});

export default wiewsRouter
