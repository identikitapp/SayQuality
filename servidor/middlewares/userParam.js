const sql = require("../utils/sql.js");

module.exports = function (req, res, next, ID) {
    if (ID == "me") {
        if (!req.user) {
            return res
                .status(401)
                .json({
                    "error": {
                        "code": 401,
                        "message": "Debes iniciar sesion."
                    }
                });
        } else {
            req.paramUser = { ...req.user };
            next();
        }
    } else {
        sql.GetUser(ID)
            .then((users) => {
                if (users.length == 0) {
                    return res
                        .status(404)
                        .json({
                            "error": {
                                "code": 404,
                                "message": "El usuario no existe."
                            }
                        });
                };

                if (users[0].status == 3) {
                    return res
                        .status(410)
                        .json({
                            "error": {
                                "code": 410,
                                "message": "La cuenta fue eliminada."
                            }
                        });
                };

                req.paramUser = users[0];
                next();
            })
            .catch((e) => {
                return res
                    .status(500)
                    .json({
                        "error": {
                            "code": 500,
                            "message": "Error interno.",
                        }
                    });
            });
    };
}