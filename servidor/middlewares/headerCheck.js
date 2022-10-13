const sql = require("../utils/sql.js");

module.exports = (request, response, next) => {
    if (request.method == "GET" || request.method == "DELETE" || request.method == "HEAD") return next();

    if (request.path.startsWith("/images")) {
        if (!request.get('Content-Type') || !request.get('Content-Type').toLowerCase() == "multipart/form-data") {
            return response
                .status(415)
                .json({
                    "error": {
                        "code": 415,
                        "message": "El encabezado Content-Type debe ser una multipart/form-data."
                    }
                });
        } else {
            return next()
        };
    } else if (request.path == "/courses/payments") {
        return next();
    };

    if (!request.get('Content-Type') || request.get('Content-Type').toLowerCase() != "application/json") {
        response
            .status(415)
            .json({
                "error": {
                    "code": 415,
                    "message": "El encabezado Content-Type debe ser application/json."
                }
            });
    };

    return next()

};