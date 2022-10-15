const mysql = require('mysql');
const events = require('events');
const updateEvent = new events.EventEmitter();
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.SQLHost,
    port: process.env.SQLPort,
    user: process.env.SQLUsername,
    password: process.env.SQLPassword,
    database: process.env.SQLDB,
    insecureAuth: true
});

connection.connect();

function DeleteStandbyUsers() {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Users SET emailCode = null, email = null, status = 3 WHERE status < 3 && deleteAccount = 1 && deleteTimestamp < ?", Date.now(), (error, results, fields) => {
            if (error) {

                reject(new Error("Error al actualizar a los usuarios"))
            };

            resolve();
        });
    });
};

setTimeout(DeleteStandbyUsers, 5000);
setInterval(DeleteStandbyUsers, 21600000);

module.exports.CreateUser = (user) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Users SET username = ?, password = ?, email = ?, emailCode = ?, status = ?, avatar = ?, deleteTimestamp = ?, deleteAccount = ?, biography = ?, linkedin = ?, facebook = ?, twitter = ?, youtube = ?, github = ?, type = ?", [user.username, user.password, user.email, user.emailCode, user.status, user.avatar, user.deleteTimestamp, user.deleteAccount, user.biography, user.linkedin, user.facebook, user.twitter, user.youtube, user.github, user.type], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al crear el usuario"))
            };

            resolve();
        });
    });
};

module.exports.GetUser = (id) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Users WHERE ID = ?", [id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener el usuario"))
            };

            resolve(results)
        });
    })
};

module.exports.GetUsers = (type) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Users WHERE type = ?", [type], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener los usuarios"))
            };

            resolve(results)
        });
    })
};

module.exports.GetUserByName = (name) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Users WHERE username = ?", [name], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener el usuario"))
            };

            resolve(results)
        });
    });
};

module.exports.GetUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Users WHERE email = ?", [email], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener el usuario"))
            };

            resolve(results)
        });
    });
};

module.exports.GetUserByCode = (code) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Users WHERE emailCode = ?", [code], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener el usuario"))
            };

            resolve(results)
        });
    });
};

module.exports.UpdateUser = (id, user) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Users SET username = ?, password = ?, email = ?, emailCode = ?, status = ?, avatar = ?, deleteTimestamp = ?, deleteAccount = ?, biography = ?, linkedin = ?, facebook = ?, twitter = ?, youtube = ?, github = ?, type = ? WHERE ID = ?", [user.username, user.password, user.email, user.emailCode, user.status, user.avatar, user.deleteTimestamp, user.deleteAccount, user.biography, user.linkedin, user.facebook, user.twitter, user.youtube, user.github, user.type, id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al actualizar el usuario"))
            };

            resolve();
        });
    });
};

//Nunca fue usado
module.exports.DeleteUser = (id, status = 3) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Users SET emailCode = null, email = null, status = ? WHERE ID = ?", [status, id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al actualizar el usuario"))
            };

            resolve();
        });
    });
};

module.exports.GetCourses = () => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Courses", (error, results, fields) => {
            if (error) {

                reject(new Error("Error al obtener los cursos"))
            };

            resolve(results)
        });
    });
};

module.exports.GetStages = (courseID) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Stages WHERE courseID = ?", [courseID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener la unidad"))
            };

            resolve(results)
        });
    });
};

module.exports.GetStage = (ID) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Stages WHERE ID = ?", [ID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener la unidad"))
            };

            resolve(results)
        });
    });
};

module.exports.GetChapters = (stageID) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Chapters WHERE stageID = ?", [stageID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener las unidades"))
            };

            resolve(results)
        });
    });
};

module.exports.GetChapter = (ID) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Chapters WHERE ID = ?", [ID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener el capitulo"))
            };

            resolve(results)
        });
    });
};

module.exports.GetHomework = (chapterID, userID) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Homeworks WHERE chapterID = ? AND userID = ?", [chapterID, userID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener la tarea"))
            };

            resolve(results)
        });
    });
};

module.exports.GetCourseByName = (name) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Courses WHERE name = ?", [name], (error, results, fields) => {
            if (error) {

                reject(new Error("Error al obtener el curso"))
            };

            resolve(results)
        });
    });
};

module.exports.CreatePayment = (payment) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Payments SET userID = ?, courseID = ?, mpPaymentID = ?, authorized = ?", [payment.userID, payment.courseID, payment.mpPaymentID, payment.authorized], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al crear el pago"))
            };

            resolve();
        });
    });
};

module.exports.UpdatePayment = (id, payment) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Payments SET userID = ?, courseID = ?, mpPaymentID = ?, authorized = ? WHERE ID = ?", [payment.userID, payment.courseID, payment.mpPaymentID, payment.authorized, id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al actualizar el pago"))
            };

            resolve();
        });
    });
};

module.exports.GetPayment = (userID, courseID) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Payments WHERE userID = ? AND courseID = ?", [userID, courseID], (error, results, fields) => {
            if (error) {console.log(error)
                reject(new Error("Error al obtener el pago"))
            };

            resolve(results)
        });
    });
};

module.exports.UpdatePaymentByUserAndCourse = (userID, courseID, payment) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Payments SET userID = ?, courseID = ?, authorized = ? WHERE userID = ? AND courseID = ?", [payment.userID, payment.courseID, payment.authorized, userID, courseID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al actualizar el pago"))
            };

            resolve();
        });
    });
};

module.exports.UpdatePaymentByMPID = (mpid, payment) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Payments SET userID = ?, courseID = ?, authorized = ? WHERE mpPaymentID = ?", [payment.userID, payment.courseID, payment.authorized, mpid], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al actualizar el pago"))
            };

            resolve();
        });
    });
};

module.exports.GetPaymentsByUser = (id) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Payments WHERE userID = ?", [id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener el pago"))
            };

            resolve(results);
        });
    });
};

module.exports.CreateChat = (chat) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Chats SET userID1 = ?, userID2 = ?, lastMessageID = ?", [chat.userID1, chat.userID2, chat.lastMessageID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al crear el usuario"))
            };

            resolve();
        });
    });
};

module.exports.GetChat = (id) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Chats WHERE ID = ?", [id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener el chat"))
            };

            resolve(results)
        });
    })
};

module.exports.GetChatsByUser = (id) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Chats WHERE userID1 = ? OR userID2 = ?", [id, id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener los chats"))
            };

            resolve(results)
        });
    })
};

module.exports.GetChatByUsers = (userID1, userID2) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Chats WHERE (userID1 = ? AND userID2 = ?) OR (userID1 = ? AND userID2 = ?)", [userID1, userID2, userID2, userID1], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener el chat"))
            };

            resolve(results)
        });
    })
};

module.exports.CreateMessage = (message) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Messages SET chatID = ?, authorID = ?, content = ?, status = ?, Timestamp = ?", [message.chatID, message.authorID, message.content, message.status, message.Timestamp], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al crear el mensaje"))
            };

            getMessageByTimestamp(message, "create", (err) => {
                if (err) {
                    return reject(err)
                };

                resolve();
            });
        });
    });
};

module.exports.GetMessagesByChat = (id, lastMessageID) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM Messages WHERE status != 3 AND chatID = ? LIMIT 50";

        if (!!lastMessageID) query = "SELECT * FROM Messages WHERE status != 3 AND chatID = ? AND ID < ? LIMIT 50";

        connection.query(query, [id, lastMessageID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener los mensajes"))
            };

            resolve(results)
        });
    })
};

module.exports.GetMessage = (id, chatID) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Messages WHERE ID = ? AND chatID = ?", [id, chatID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al obtener el mensaje"))
            };

            resolve(results)
        });
    })
};

module.exports.UpdateMessage = (id, message) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Messages SET chatID = ?, authorID = ?, content = ?, status = ?, Timestamp = ? WHERE ID = ?", [message.chatID, message.authorID, message.content, message.status, message.Timestamp, id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al actualizar mensaje"))
            };

            resolve();
        });
    });
};

module.exports.DeleteMessage = (id, chatID) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Messages SET status = 3 WHERE ID = ? AND chatID = ?", [id, chatID], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al actualizar el mensaje"))
            };

            connection.query("UPDATE Chats SET lastMessageID = (SELECT ID FROM Messages WHERE status != 3 AND chatID = ? ORDER BY ID DESC LIMIT 1) WHERE ID = ?", [chatID, chatID], (error2, results, fields) => {
                if (error2) {
                    reject(new Error("Error al actualizar el chat"))
                };

                getMessageByID(id, "delete", (err) =>{
                    if (err) {
                        return reject(err)
                    };
    
                    resolve();
                });
            });
        });
    });
};

function getMessageByTimestamp(message, action, cb) {
    connection.query("SELECT * FROM Messages WHERE chatID = ? AND Timestamp = ? LIMIT 1", [message.chatID, message.Timestamp], (error, results, fields) => {
        if (error) {
            cb(new Error("Error al obtener el chat"))
        };

        updateLastMessage(results[0], action, cb);
    });
};

function getMessageByID(ID, action, cb) {
    connection.query("SELECT * FROM Messages WHERE ID = ? LIMIT 1", [ID], (error, results, fields) => {
        if (error) {
            cb(new Error("Error al obtener el chat"))
        };

        getChat(results[0].chatID, results[0], action, cb);
    });
};

function updateLastMessage(message, action, cb) {
    connection.query("UPDATE Chats SET lastMessageID = ? WHERE ID = ?", [message.ID, message.chatID], (error, results, fields) => {
        if (error) {
            cb(new Error("Error al crear el usuario"))
        };

        getChat(message.chatID, message, action, cb);
    });
};

function getChat(id, message, action, cb) {
    connection.query("SELECT * FROM Chats WHERE ID = ?", [id], (error, results, fields) => {
        if (error) {
            cb(new Error("Error al obtener el chat"))
        };

        notifyMessage(results[0], message, action, cb);
    });
};

function notifyMessage(chat, message, action, cb) {
    updateEvent.emit("update", {
        action,
        message,
        chat
    });

    cb(null);
};

module.exports.MessageEvent = updateEvent;

module.exports.Chat = class {
    constructor(Chat) {
        if (!Chat.userID1) {
            this.userID1 = 0;
        } else {
            this.userID1 = Chat.userID1;
        };

        if (!Chat.userID2) {
            this.userID2 = 0;
        } else {
            this.userID2 = Chat.userID2;
        };

        if (!Chat.lastMessageID) {
            this.lastMessageID = null;
        } else {
            this.lastMessageID = Chat.lastMessageID;
        };
    };
};

module.exports.Message = class {
    constructor(Chat) {
        if (!Chat.chatID) {
            this.chatID = 0;
        } else {
            this.chatID = Chat.chatID;
        };

        if (!Chat.authorID) {
            this.authorID = 0;
        } else {
            this.authorID = Chat.authorID;
        };

        if (!Chat.content) {
            this.content = "";
        } else {
            this.content = Chat.content;
        };

        if (!Chat.status) {
            this.status = 0;
        } else {
            this.status = Chat.status;
        };

        if (!Chat.Timestamp) {
            this.Timestamp = 0;
        } else {
            this.Timestamp = Chat.Timestamp;
        };
    };
};

module.exports.Payment = class {
    constructor(Payment) {
        if (!Payment.userID) {
            this.userID = 0;
        } else {
            this.userID = Payment.userID;
        };

        if (!Payment.courseID) {
            this.courseID = 0;
        } else {
            this.courseID = Payment.courseID;
        };

        if (!Payment.mpPaymentID && Payment.mpPaymentID != null) {
            this.mpPaymentID = 0;
        } else {
            this.mpPaymentID = Payment.mpPaymentID;
        };

        if (!Payment.authorized) {
            this.authorized = false;
        } else {
            this.authorized = Payment.authorized;
        };
    };
};

module.exports.User = class {
    constructor(user) {
        if (!user.username) {
            this.username = "";
        } else {
            this.username = user.username;
        };

        if (!user.ID) {
            this.ID = 0;
        } else {
            this.ID = user.ID;
        };

        if (!user.password) {
            this.password = "";
        } else {
            this.password = user.password;
        };

        if (!user.biography) {
            this.biography = "";
        } else {
            this.biography = user.biography;
        };

        if (!user.email) {
            this.email = "";
        } else {
            this.email = user.email;
        };

        if (!user.emailCode) {
            this.emailCode = "";
        } else {
            this.emailCode = user.emailCode;
        };

        if (!user.status) {
            this.status = 1;
        } else {
            this.status = user.status;
        };

        if (!user.avatar) {
            this.avatar = "";
        } else {
            this.avatar = user.avatar;
        };

        if (!user.linkedin) {
            this.linkedin = "";
        } else {
            this.linkedin = user.linkedin;
        };

        if (!user.facebook) {
            this.facebook = "";
        } else {
            this.facebook = user.facebook;
        };

        if (!user.twitter) {
            this.twitter = "";
        } else {
            this.twitter = user.twitter;
        };

        if (!user.youtube) {
            this.youtube = "";
        } else {
            this.youtube = user.youtube;
        };

        if (!user.github) {
            this.github = "";
        } else {
            this.github = user.github;
        };

        if (!user.deleteTimestamp) {
            this.deleteTimestamp = 0;
        } else {
            this.deleteTimestamp = user.deleteTimestamp;
        };

        if (!user.deleteAccount) {
            this.deleteAccount = false;
        } else {
            this.deleteAccount = user.deleteAccount;
        };

        if (!user.type) {
            this.type = 1;
        } else {
            this.type = user.type;
        };

    };
};