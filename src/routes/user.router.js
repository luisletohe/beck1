import { Router } from "express";
import passport from "passport";
import { generateToken, middlewarePassportJwt } from "../middleware/jwt.middleware.js";
import ErrorCodes from "../utils/error.js";
import { generateErrorAutenticacion, generateErrorDeslogueo, generateErrorEnrutamiento, generateErrorFile } from "../utils/info.js";
import CustomErrors from "../utils/customError.js";
import userController from "../controllers/user.controller.js";
import { transporter } from "../utils/nodemailer.js";
import enviroment from "../config/enviroment.js";
import { comparePassword, hashPassword } from "../utils/encript.util.js";
import { uploadGeneric } from "../middleware/uploadgeneric.middleware.js";
import cron from 'node-cron'


import jwt from 'jsonwebtoken';
import userModel from "../models/user.model.js";
import UsersAdminDTO from "../dto/adminUsers.js";



const privatesecret = enviroment.KEYJWT;

const userRouter = Router()



userRouter.post('/', (req, res, next) => {
	passport.authenticate('register', (err, user, info) => {
		if (user) {
			res.status(200).redirect('/login')
		}

		if (info) {

			req.logger.warn('Error de autenticacion en registro')
			CustomErrors.createError("Error de autenticacion", generateErrorAutenticacion(), 'Register Error', ErrorCodes.AUTENTICACION_ERROR);
		}

		return next(err)

	})(req, res, next);
});


userRouter.post('/auth', (req, res, next) => {
	passport.authenticate('login', async (err, user, info) => {

		if (err) {
			return next(err)
		}

		if (user) {

			const token = generateToken(user);

			user.last_connection = new Date()
			await user.save()

			res.cookie('token', token, {
				httpOnly: true,
				maxAge: 60000000,
			}).redirect('/profile');
		} else {
			req.logger.warn('Error de autenticacion en login')
			res.redirect('/dataerror')
		}


	})(req, res, next);
});




userRouter.post('/logout', middlewarePassportJwt, (req, res, next) => {

	if (req.user) {
		req.session.destroy();
		res.clearCookie('connect.sid');
		res.clearCookie('token');
		res.redirect('/login');
	} else {
		CustomErrors.createError('problemas en deslogueo', generateErrorDeslogueo(), 'no se pudo desloguear el usuario', ErrorCodes.DESLOGUEO_ERROR);
	}
});


userRouter.post('/premium/:uid', async (req, res, next) => {
	const userId = req.params.uid

	try {
		const user = await userController.getUserById(userId)
		const userDocuments = user.documents;

		if (!userDocuments.addressProof || !userDocuments.bankStatement || !userDocuments.identification) {
			req.logger.warn("necesita cargar toda la documentacion antes de pasar a premium")
			res.redirect('/falsedocuments');

		} else {

			if (user.rol === "USER") {
				user.rol = "PREMIUM"
				user.save()
			} else {
				user.rol = "USER"
				user.save()
			}

			req.session.destroy();
			res.clearCookie('connect.sid');
			res.clearCookie('token');
			res.redirect('/login')
		}



	} catch (err) {
		req.logger.error(`no se puedo cambiar el rol `)
	}
});


userRouter.get('/getUser', async (req, res, next) => {
	try {
		const usuarios = await userController.getAll()
		const dto = new UsersAdminDTO(usuarios)

		res.status(200).send(dto)
	} catch (error) {
		res.status(500).json({ error: "Error a traer los usuarios" });
	}
})


userRouter.delete('/deleteuser/:uid', async (req, res, next) => {
	try {
		const user = req.params.uid
		const deleteUser = await userController.deleteUserById(user)
		res.status(200).json({ message: "Usuario eliminado con éxito" })
	} catch (error) {
		res.status(500).json({ error: "Error al eliminar el usuario" });
	}

})


userRouter.delete('/autodelete/', async (req, res, next) => {
	try {

		const usersToDelete = await userController.getInactiveUsers();
		for (const user of usersToDelete) {

			if (user.rol === 'ADMIN') {
				req.logger.warn("EL ADMIN NO SE ELIMINA")
			} else {
				const id = user._id.toString()
				const deleteUsers = await userController.deleteUserById(id)
				
				const emailOptions = {
					from: `NOTIFICACION VIP <mitchel2206@gmail.com>`,
					to: `${deleteUsers.email}`,
					subject: 'Eliminamos su cuenta por inactividad en VIP',
					html: `
					  <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 30px;">
						   <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
							   <div style="text-align: center; padding: 20px 0;">
							   <h1 style="color: #333;"> ${deleteUsers.first_name} hemos eliminamos tu cuenta por inactividad</h1>
							   <img class="logo" src="https://i.postimg.cc/pL1mYXqM/VIP-fotor-bg-remover-20230624162050.png"
						   </div>
						   <div style="padding: 20px;">
								  <p style="margin-bottom: 20px; font-size: 16px; color: #333;"> Cuando gustes puedes volver con nosotros</p>
								   <p style="font-size: 14px; color: #777;">Si no fuiste usuario, puedes ignorar este correo electrónico.</p>
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
		}
	} catch (error) {
		res.status(500).json({ error: "Error al eliminar el usuario" });
	}

})


cron.schedule('0 0 * * *', async () => {
	try {

		const url = `http://localhost:8080/api/users/autodelete/`;

		const response = await fetch(url, {
			method: 'DELETE',
		});

		if (response.ok) {
			req.logger.info('Eliminación automática ejecutada con éxito');
		} else {
			req.logger.error('Error al ejecutar la eliminación automática');
		}
	} catch (error) {
		res.status(500).json({ error: "Error al eliminar el usuario" });
	}
});


userRouter.post('/updateRolAdmin/:uid', async (req, res, next) => {
	const userId = req.params.uid

	try {
		const user = await userController.getUserById(userId)

		if (user.rol === "USER") {
			user.rol = "PREMIUM"
			user.save()
		} else {
			user.rol = "USER"
			user.save()
		}

		res.status(200).json({ message: "Cambio de rol con éxito" })
	} catch (err) {
		req.logger.error(`no se puedo cambiar el rol`)
		res.status(500).json({ error: "No se puedo cambiar el rol" });

	}
});






userRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (err, req, res, next) => {
	if (err) {
		CustomErrors.createError('Error Routing', generateErrorEnrutamiento(), 'no redireciono', ErrorCodes.ROUTING_ERROR)
	}

});


userRouter.get('/githubcallback', passport.authenticate('github'),
	(req, res) => {

		const user = req.user;
		const token = generateToken(user)
		res.cookie('token', token, {
			httpOnly: true,
			maxAge: 60000000,
		}).redirect('/profile')

	}
)



userRouter.post('/forgotpassword', async (req, res, next) => {
	const uid = req.body;

	try {
		const user = await userController.getByEmail(uid.email)
		const token = generateToken(user);

		const emailOptions = {
			from: `Restablecer Contraseña <mitchel2206@gmail.com>`,
			to: `${user.email}`,
			subject: 'Restablecimiento de Contraseña',
			html: `
              <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
                   <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);">
                       <div style="text-align: center; padding: 20px 0;">
                       <h1 style="color: #333;">Restablecer tu Contraseña</h1>
					   <img class="logo" src="https://i.postimg.cc/pL1mYXqM/VIP-fotor-bg-remover-20230624162050.png"
                   </div>
                   <div style="padding: 20px;">
                          <p style="margin-bottom: 20px; font-size: 16px; color: #333;">Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
                          <p style="margin-bottom: 20px;">
                           <a style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #ffffff; text-decoration: none; border-radius: 5px;" href="https://back-coder-production.up.railway.app/forgotpassword/${token}">Restablecer Contraseña</a>
                           </p>
                           <p style="font-size: 14px; color: #777;">Si no has solicitado esto, puedes ignorar este correo electrónico.</p>
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
		res.redirect('/emailsent')
	} catch (err) {
		req.logger.error('no se envio el email de restablecimiento')
	}

});


userRouter.post('/emailreset/:token', async (req, res, next) => {
	const user = req.params.token;
	const newPassword = req.body
	const password = newPassword.password

	try {
		const decodedUser = jwt.verify(user, privatesecret);
		const userID = await userModel.findById(decodedUser._id)

		if (comparePassword(decodedUser, newPassword.password)) {
			req.logger.warn(" no puede ser la misma contrasena")
			return res.redirect('/errorpassword')
		}

		const HashPassword = await hashPassword(password)
		userID.password = HashPassword
		userID.save()

		res.redirect('/login')
	} catch (err) {
		req.logger.error('expiro el tiempo, debe volver a enviar el email')
		res.redirect('/restpassword')
	}
});



userRouter.post("/:uid/products", uploadGeneric('public/img/products', ".jpg").single("products"),
	(req, res) => {
		const file = req.file;

		if (file === undefined) {

			req.logger.warn('No se cargo el archivo')
			CustomErrors.createError('Error file', generateErrorFile(), 'No se envio el archivo', ErrorCodes.FILE_ERROR)
		}
	
		req.logger.info(`File uploaded successfully, ${file}`)
		res.redirect('/archivoenviado')


	}
);

userRouter.post("/:uid/profiles", uploadGeneric('public/img/profiles', ".jpg").single("profiles"),
	(req, res) => {

		const file = req.file;

		if (file === undefined) {
			req.logger.warn('No se cargo el archivo')
			CustomErrors.createError('Error file', generateErrorFile(), 'No se envio el archivo', ErrorCodes.FILE_ERROR)
		}
	
		req.logger.info(`File uploaded successfully, ${file}`)
		res.redirect('/archivoenviado')


	}
);

userRouter.post("/:uid/documents", uploadGeneric('public/documents/', ".pdf").single("documents"),
	(req, res) => {

		const file = req.file;

		if (file === undefined) {
			req.logger.warn('No se cargo el archivo')
			CustomErrors.createError('Error file', generateErrorFile(), 'No se envio el archivo', ErrorCodes.FILE_ERROR)
		}

		req.logger.info(`File uploaded successfully, ${file}`)
		res.redirect('/archivoenviado')

	}
);


userRouter.post("/:uid/useridentification", uploadGeneric('public/documents/userdocuments', ".pdf").single("identification"),
	async (req, res) => {

		try {

			if (req.file === undefined) {
				req.logger.warn('no se envio ningun archivo')
				res.render('faltadearchivos')
			}

			const file = req.file;
			const fileName = file.filename;
			const id = req.params;
			const user = await userController.getUserById(id.uid)
	
			user.documents.identification = fileName
			await user.save()

			req.logger.info(`File uploaded successfully, ${file}`)
			res.redirect('/archivoenviado')
		} catch (err) {
			res.status(400)
		}
	}
)



userRouter.post("/:uid/useraddressproof", uploadGeneric('public/documents/useraddressproof', ".pdf").single("addressproof"),
	async (req, res) => {

		try {

			if (req.file === undefined) {
				req.logger.warn('no se envio ningun archivo')
				res.render('faltadearchivos')
			}

			const file = req.file;
			const fileName = file.filename;

			const id = req.params;
			const user = await userController.getUserById(id.uid)
			user.documents.addressProof = fileName
			await user.save()

			req.logger.info(`File uploaded successfully, ${file}`)
			res.redirect('/archivoenviado')
		} catch (err) {
			res.status(400)
		}
	}
)


userRouter.post("/:uid/userbankstatement", uploadGeneric('public/documents/userbankstatement', ".pdf").single("bankstatement"),
	async (req, res) => {

		try {

			if (req.file === undefined) {
				req.logger.warn('no se envio ningun archivo')
				res.redirect('/faltadearchivos')
			}

			const file = req.file;
			const fileName = file.filename;

			const id = req.params;
			const user = await userController.getUserById(id.uid)
			user.documents.bankStatement = fileName
			await user.save()

			req.logger.info(`File uploaded successfully, ${file}`)
			res.redirect('/archivoenviado')
		} catch (err) {
			res.status(400)
		}
	}
)

export { userRouter }
