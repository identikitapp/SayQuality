const sql = require("../utils/sql.js");

module.exports = (request, response, next) => {
    if (request.method == "GET" || request.method == "DELETE" || request.method == "HEAD") return next();

    if (request.path.startsWith("/files")) {
        if (!request.get('Content-Type') || request.get('Content-Type').toLowerCase() != "image/png") {
            return response
                .status(415)
                .json({
                    "error": {
                        "message": "El encabezado Content-Type debe ser una image/png."
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
                    "message": "El encabezado Content-Type debe ser application/json."
                }
            });
    };

    return next()

};