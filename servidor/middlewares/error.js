const sql = require("../utils/sql.js");

module.exports = (error, request, response, next) => {

    if (error.statusCode == 413) {

        return response
            .status(413)
            .json({
                "error": {
                    
                    "message": "El cuerpo de la peticion es muy largo."
                }
            });

    };

    if (error.type == 'entity.parse.failed') {
        return response
            .status(400)
            .json({
                "error": {
                    
                    "message": "El cuerpo de la peticion esta malformado."
                }
            });
    };

    response
        .status(500)
        .json({
            "error": {
                
                "message": "Error interno.",
            }
        });
};