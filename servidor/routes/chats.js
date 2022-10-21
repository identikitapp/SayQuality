const express = require("express");
const chats = express.Router();
const sql = require("../utils/sql.js");
const rateLimit = require("../utils/rateLimit.js");

chats.param('ID', require("../middlewares/chatParam.js"));

chats.param('MsgID', require("../middlewares/messageParam.js"));

chats.get("/", (req, res, next) => {

    if (!req.user) {
        return res
            .status(401)
            .json({
                "error": {
                    "message": "Debes iniciar sesion para hacer eso."
                }
            });
    };

    sql.GetChatsByUser(req.user.ID)
        .then((chats) => {
            res
                .status(200)
                .json({
                    data: {
                        message: "Chats obtenido con exito.",
                        chats
                    }
                });
        })
        .catch(function (error) {
            return res
                .status(500)
                .json({
                    "error": {
                        "message": "Error interno.",
                    }
                });
        });

});

chats.post("/", rateLimit.createChat, (req, res) => {
    if (!req.user) {
        return res
            .status(401)
            .json({
                "error": {
                    "message": "Debes iniciar sesion para hacer eso."
                }
            });
    };
    let body = req.body;

    if (typeof body.ID != "number") {
        return res
            .status(422)
            .json({
                "error": {
                    "message": "Por favor ingrese una ID de usuario."
                }
            });
    };

    if (typeof body.ID == 0) {
        return res
            .status(404)
            .json({
                "error": {
                    "message": "El usuario no existe."
                }
            });
    };

    CheckChat(req, res, 0);

});

chats.get("/:ID", (req, res) => {

    if (!!req.query.lastMessageID) {
        try {
            parseInt(req.query.lastMessageID)
        } catch (e) {
            return res
                .status(422)
                .json({
                    "error": {
                        "message": "El parametro lastMessageID no es un numero valido."
                    }
                });
        };
    };

    sql.GetMessagesByChat(req.paramChat.ID, req.query.lastMessageID)
        .then((messages) => {
            return res
                .status(200)
                .json({
                    data: {
                        message: "Chat obtenido con exito.",
                        messages
                    }
                });
        })
        .catch((e) => {
            return res
                .status(500)
                .json({
                    "error": {
                        "message": "Error interno.",
                    }
                });
        });
});

chats.post("/:ID", (req, res) => {
    let body = req.body;

    if (!body.content || typeof body.content != "string" || body.content.length > 100) {
        return res
            .status(422)
            .json({
                "error": {
                    "message": "El nombre de usuario es demasiado largo o no lo a ingresado."
                }
            });
    };

    sql.CreateMessage(new sql.Message({
        chatID: req.paramChat.ID,
        authorID: req.user.ID,
        content: body.content,
        status: 1,
        Timestamp: Date.now()
    }))
        .then(() => {
            return res
                .status(201)
                .json({
                    data: {
                        message: "Mensaje creado con exito."
                    }
                });
        })
        .catch(function (error) {
            return res
                .status(500)
                .json({
                    "error": {
                        "message": "Error interno."
                    }
                });
        });


});

chats.get("/:ID/:MsgID", (req, res) => {
    return res
        .status(200)
        .json({
            data: {
                message: "Mensaje obtenido con exito.",
                messages: [req.paramMessage]
            }
        });
});

chats.delete("/:ID/:MsgID", (req, res) => {
    sql.DeleteMessage(req.paramMessage.ID, req.paramChat.ID)
        .then(() => {
            return res
                .status(200)
                .json({
                    data: {
                        message: "Mensaje eliminado con exito."
                    }
                });
        })
        .catch(function (error) {
            return res
                .status(500)
                .json({
                    "error": {
                        "message": "Error interno."
                    }
                });
        });
});

function CheckChat(req, res, c) {
    c++
    if (c > 5) {
        return res
            .status(508)
            .json({
                "error": {
                    "message": "Error al crear chat."
                }
            });
    };

    let body = req.body;

    sql.GetChatByUsers(body.ID, req.user.ID)
        .then((chats) => {
            if (chats.length == 0) {
                CheckUser(req, res, c++)
            } else {

                let status = 200;
                let message = "Chat obtenido con exito.";

                if (c != 1) {
                    status = 201;
                    message = "Chat creado con exito.";

                    sql.CreateLog(new sql.Log({
                        userAgent: req.get("User-Agent"),
                        acceptLanguage: req.get("Accept-Language"),
                        ip: req.ip,
                        timestamp: Date.now(),
                        chatID: chats[0].ID,
                        userID: req.user.ID,
                        action: 10
                    }));
                };

                return res
                    .status(status)
                    .json({
                        data: {
                            message,
                            chat: chats[0]
                        }
                    });
            };
        })
        .catch(function (error) {
            return res
                .status(500)
                .json({
                    "error": {
                        "message": "Error interno."
                    }
                });
        });
};

function CheckUser(req, res, c) {
    c++
    let body = req.body;
    sql.GetUser(body.ID)
        .then((users) => {
            if (users.length == 0) {
                return res
                    .status(404)
                    .json({
                        "error": {
                            "message": "El usuario no existe."
                        }
                    });
            };

            CreateChat(req, res, c++);

        })
        .catch(function (error) {
            return res
                .status(500)
                .json({
                    "error": {
                        "message": "Error interno."
                    }
                });
        });
};

function CreateChat(req, res, c) {
    c++
    let body = req.body;
    sql.CreateChat(new sql.Chat({
        userID1: req.user.ID,
        userID2: body.ID,
        lastMessageID: null
    }))
        .then(() => {
            CheckChat(req, res, c++);
        })
        .catch(function (error) {
            return res
                .status(500)
                .json({
                    "error": {
                        "message": "Error interno."
                    }
                });
        });
};

module.exports = chats;