import ErrorCodes from "../utils/error.js";

export default (err, req, res, next) => {
    req.logger.warn(err, 'Me permite hacer seguimiento de los errores que debo capturar')
    switch (err.code) {

        case ErrorCodes.INVALID_TYPE:
            res.render('dataerror')
            break;
        case ErrorCodes.ROUTING_ERROR:
            res.render('dataerror')
            break;
        case ErrorCodes.DESLOGUEO_ERROR:
            res.render('dataerror')
            break;
        case ErrorCodes.AUTENTICACION_ERROR:
            res.render('errorautorizacion')
            break;
        case ErrorCodes.ADMIN_NOAUTHORIZATION:
            res.render('errorautorizacion')
            break;
        case ErrorCodes.PRODUCT_ERROR:
            res.status(400)
            break;
        case ErrorCodes.CART_ERROR:
            res.status(400)
            break;
        case ErrorCodes.TICKET_ERROR:
            res.status(400)
            break;
        case ErrorCodes.FILE_ERROR:
            res.render('faltadearchivos')
            break;
        default:
            res.render('errorservidor');
            break;
    }
};