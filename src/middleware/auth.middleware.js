import productController from "../controllers/product.controller.js";
import CustomErrors from "../utils/customError.js";
import ErrorCodes from "../utils/error.js";
import { generateErrorAutenticacion } from "../utils/info.js";

export function isAuth(req, res, next) {
	if (req.user.rol === 'ADMIN') {
		req.logger.warn(`${req.user.rol} no autorizado`);
		CustomErrors.createError('Admi no usa chat', generateErrorAutenticacion(), 'El admin no esta autorizado', ErrorCodes.ADMIN_NOAUTHORIZATION)
	}
	next();

}


export async function checkAuthorization(req, res, next) {
	const userRole = req.user.rol;
	const products = await productController.getProductsById(req.params.uid);
	const product = products[0];
	const productOwner = product.owner;

	if (userRole === 'PREMIUM' && req.user.email !== productOwner) {
		req.logger.warn(`${userRole}, "No puedes eliminar productos que no son tuyos"`);
		return res.sendStatus(500)
	}
	next();
}


export async function checkCartAuthorization(req, res, next) {
	const userRole = req.user.rol;
	const pid = req.params.pid;
	const products = await productController.getProductsById(pid);
	const product = products[0];
	const productOwner = product.owner;

	if (userRole === 'PREMIUM' && req.user.email === productOwner) {
		req.logger.warn(`${userRole}, No puedes agregar tu propio producto al carrito`);
		return res.sendStatus(500)
	}
	next();
}