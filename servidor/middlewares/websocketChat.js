const sql = require("../utils/sql.js");

module.exports = (connection, req) => {

    if (!!req.AuthErr) {
        return connection.close(3000, req.AuthErr);
    } else if (!!req.Err) {
        return connection.close(1011, req.AuthErr);
    };

    sql.MessageEvent.on("update", (data) => {
        if (req.user.ID != data.chat.userID1 && req.user.ID != data.chat.userID2) {
            return;
        };

        if (data.message.authorID == req.user.ID) {
            return;
        };

        connection.send(JSON.stringify(data));
    });

    connection.on('message', function (message) {
        try {
            let data = JSON.parse(message);

            if (!data.MessageID || typeof data.MessageID != "number") {
                return connection.send("Por favor ingrese la ID de un mensaje.");
            };

            if (!data.ChatID || typeof data.ChatID != "number") {
                return connection.send("Por favor ingrese la ID de un chat.");
            };

            ReadMessage(req.user, data.MessageID, data.ChatID)
                .then((text) => {
                    connection.send(text);
                })
                .catch((text) => {
                    connection.close(1008, text);
                });

        } catch (e) {
            return connection.close(1003, "Los datos enviados deben ser un JSON.");
        };
    });

};

function ReadMessage(User, MessageID, ChatID) {
    return new Promise((resolve, reject) => {

        sql.GetMessage(MessageID, ChatID)
            .then((messages) => {
                let message = messages[0];
                sql.GetChat(ChatID)
                    .then((chats) => {
                        if (chats.length == 0) {
                            reject("El message no existe.");
                        };

                        let chat = chats[0];

                        if (User.ID != chat.userID1 && User.ID != chat.userID2) {
                            reject("No estas autorizado para hacer eso.");
                        };

                        if (messages.length == 0) {
                            reject("El message no existe.");
                        };

                        if (message.authorID == User.ID) {
                            reject("No estas autorizado para hacer eso.");
                        };

                        if (message.status == 3) {
                            resolve("El message fue eliminado.");
                        } else if (message.status == 2) {
                            resolve("El message ya esta leido.");
                        };

                        message.status = 2;

                        sql.UpdateMessage(message.ID, message)
                            .then(() => {
                                resolve("Mensaje leido");
                            })
                            .catch((e) => {
                                reject("Error interno");
                            })
                    })
                    .catch((e) => {
                        reject("Error interno");
                    })
            })
            .catch((e) => {
                reject("Error interno");
            })
    });
};