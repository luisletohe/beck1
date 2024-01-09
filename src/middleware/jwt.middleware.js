import jwt from 'jsonwebtoken';
import passport from 'passport';
import enviroment from '../config/enviroment.js';


const privatekey = enviroment.KEYJWT;

const generateToken = (user) => {
	return jwt.sign(user.toJSON(), privatekey, { expiresIn: '1h' });
};

const authToken = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		res.status(401).send({ message: 'Token not found' });
	}

	jwt.verify(authHeader, privatekey, (err, credentials) => {
		if (err) {
			res.status(401).send({ message: 'Token not valid' });
		}
		req.user = credentials.user;
		next();
	});
};


const middlewarePassportJwt = async (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, usr, info) => {


		if (err) {
			next(err);
		}

		if (!usr) {
			res.redirect('/errorcaduco')
		} else {
			req.user = usr
			next()
		}

	})(req, res, next);
}





export { generateToken, authToken, middlewarePassportJwt };