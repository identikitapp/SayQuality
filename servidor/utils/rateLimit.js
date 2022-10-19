const rateLimit = require('express-rate-limit');

module.exports.register = rateLimit({
    windowMs: 86400000, //un dia
    max: 2, //dos veces x dia
    message: "Pasaste el limite, intenta de nuevo mas tarde.",
    standardHeaders: true,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            error: {
                message: options.message
            }
        })
    }
});

module.exports.login = rateLimit({
    windowMs: 3600000, //una hora
    max: 3, //tres veces x hora
    message: "Pasaste el limite, intenta de nuevo mas tarde.",
    standardHeaders: true,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            error: {
                message: options.message
            }
        })
    }
});

module.exports.uploadImage = rateLimit({
    windowMs: 21600000, //seis horas
    max: 2, //dos vecex x 6 horas
    message: "Pasaste el limite, intenta de nuevo mas tarde.",
    standardHeaders: true,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            error: {
                message: options.message
            }
        })
    }
});

module.exports.submitForm= rateLimit({
    windowMs: 21600000, //seis horas
    max: 2, //dos veces x 6 horas
    message: "Pasaste el limite, intenta de nuevo mas tarde.",
    standardHeaders: true,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            error: {
                message: options.message
            }
        })
    }
});

module.exports.updateUser = rateLimit({
    windowMs: 3600000, //una hora
    max: 3, //tres veces x hora
    message: "Pasaste el limite, intenta de nuevo mas tarde.",
    standardHeaders: true,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            error: {
                message: options.message
            }
        })
    }
});

module.exports.createChat = rateLimit({
    windowMs: 3600000, //una hora
    max: 4, //cuatro veces x hora
    message: "Pasaste el limite, intenta de nuevo mas tarde.",
    standardHeaders: true,
    handler: (request, response, next, options) => {
        response.status(options.statusCode).json({
            error: {
                message: options.message
            }
        })
    }
});