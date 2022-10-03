const sql = require("../utils/sql.js");

module.exports = function (req, res, next, MsgID) {
    sql.GetMessage(MsgID, req.paramChat.ID)
        .then((messages) => {
            if (messages.length == 0) {
                return res
                    .status(404)
                    .json({
                        "error": {
                            "code": 404,
                            "message": "El message no existe."
                        }
                    });
            };

            if (messages[0].status == 3) {
                return res
                    .status(410)
                    .json({
                        "error": {
                            "code": 410,
                            "message": "El message fue eliminado."
                        }
                    });
            };

            req.paramMessage = messages[0];
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