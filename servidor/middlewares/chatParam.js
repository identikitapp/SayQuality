const sql = require("../utils/sql.js");

module.exports = function (req, res, next, ID) {
    if (!req.user) {
        return res
            .status(401)
            .json({
                "error": {
                    "code": 401,
                    "message": "Debes iniciar sesion para hacer eso."
                }
            });
    };

    sql.GetChat(ID)
        .then((chats) => {
            if (chats.length == 0) {
                res
                    .status(404)
                    .json({
                        "error": {
                            "code": 404,
                            "message": "El chat no existe."
                        }
                    });
                return;
            };

            if (req.user.ID != chats[0].userID1 && req.user.ID != chats[0].userID2) {
                if (!req.user) {
                    return res
                        .status(403)
                        .json({
                            "error": {
                                "code": 403,
                                "message": "No estas autorizado para hacer eso."
                            }
                        });
                };
            };

            req.paramChat = chats[0];
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
}