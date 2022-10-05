const sql = require("../utils/sql.js");

module.exports = (error, request, response, next) => {

    if (error.statusCode == 413) {

        return response
            .status(413)
            .json({
                "error": {
                    "code": 413,
                    "message": "El cuerpo de la peticion es muy largo, usa 5MB o menos."
                }
            });

    };

    if (error.type == 'entity.parse.failed') {
        return response
            .status(400)
            .json({
                "error": {
                    "code": 400,
                    "message": "El cuerpo de la peticion esta malformado."
                }
            });
    };

    response
        .status(500)
        .json({
            "error": {
                "code": 500,
                "message": "Ocurrio un error, intenta de nuevo mas tarde."
            }
        });


}