import winston from "winston";
import enviroment from "../config/enviroment.js";


const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'blue',
    debug: 'white',
};


winston.addColors(colors);

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.simple(),
                winston.format.printf((info) => {
                    return `${info.level}: ${info.message}`;
                })
            )
        }),
        new winston.transports.File({ filename: 'register.log', level: 'warn' }),
    ],
});

const productionLogger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'production.log', level: 'info' }),
    ],
});

export const loggerMiddleware = (req, res, next) => {
    req.logger = logger;

    if ( enviroment.NODE_ENV === 'production') {
        req.logger = productionLogger;
    }

    logger.info(`${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')} - ${new Date().toISOString()}`);
    next();
};

