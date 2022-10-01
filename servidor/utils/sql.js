const mysql = require('mysql');
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
        connection.query("UPDATE Users SET emailCode = null, email = null, userStatus = 3 WHERE userStatus < 3 && deleteAccount = 1 && deleteTimestamp > "+Date.now(), (error, results, fields) => {
            if (error) {
                reject(new Error("Error al actualizar a los usuarios"))
            };

            resolve();
        });
    });
};

DeleteStandbyUsers();
setInterval(DeleteStandbyUsers, 21600000);

module.exports.CreateUser = (user) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Users SET username = ?, password = ?, email = ?, emailCode = ?, userStatus = ?, avatar = ?, deleteTimestamp = ?, deleteAccount = ?, biography = ?, linkedin = ?, facebook = ?, twitter = ?, youtube = ?", [user.username, user.password, user.email, user.emailCode, user.status, user.avatar, user.deleteTimestamp, user.deleteAccount, user.biography, user.linkedin, user.facebook, user.twitter, user.youtube], (error, results, fields) => {
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
                console.log(error)
                reject(new Error("Error al obtener el usuario"))
            };

            resolve(results)
        });
    })
};

module.exports.GetUserByName = (name) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Users WHERE username = ?", [name], (error, results, fields) => {
            if (error) {
                console.log(error)
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
        connection.query("UPDATE Users SET username = ?, password = ?, email = ?, emailCode = ?, userStatus = ?, avatar = ?, deleteTimestamp = ?, deleteAccount = ?, biography = ?, linkedin = ?, facebook = ?, twitter = ?, youtube = ? WHERE ID = ?", [user.username, user.password, user.email, user.emailCode, user.status, user.avatar, user.deleteTimestamp, user.deleteAccount, user.biography, user.linkedin, user.facebook, user.twitter, user.youtube, id], (error, results, fields) => {
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
        connection.query("UPDATE Users SET emailCode = null, email = null, userStatus = ? WHERE ID = ?", [status, id], (error, results, fields) => {
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
                console.log(error)
                reject(new Error("Error al obtener el usuario"))
            };

            resolve(results)
        });
    });
};

module.exports.GetCourseByName = (name) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Courses WHERE name = ?", [name], (error, results, fields) => {
            if (error) {
                console.log(error)
                reject(new Error("Error al obtener el usuario"))
            };

            resolve(results)
        });
    });
};

module.exports.CreatePayment = (payment) => {
    return new Promise((resolve, reject) => {
        connection.query("INSERT INTO Payments SET userID = ?, courseID = ?, mpPaymentID = ?, authorized = ?", [payment.userID, payment.courseID, payment.mpPaymentID, payment.authorized], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al crear el usuario"))
            };

            resolve();
        });
    });
};

module.exports.UpdatePayment = (id, payment) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Payments SET userID = ?, courseID = ?, mpPaymentID = ?, authorized = ? WHERE ID = ?", [payment.userID, payment.courseID, payment.mpPaymentID, payment.authorized, id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al crear el usuario"))
            };

            resolve();
        });
    });
};

module.exports.UpdatePaymentByMPID = (mpid, payment) => {
    return new Promise((resolve, reject) => {
        connection.query("UPDATE Payments SET userID = ?, courseID = ?, authorized = ? WHERE ID = ?", [payment.userID, payment.courseID, payment.authorized, mpid], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al crear el usuario"))
            };

            resolve();
        });
    });
};

module.exports.GetPaymentsByUser = (id) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM Payments WHERE userID = ?", [id], (error, results, fields) => {
            if (error) {
                reject(new Error("Error al crear el usuario"))
            };

            resolve(results);
        });
    });
};


module.exports.Payment = class {
    constructor(Payment){
        if (!Payment.userID) {
            this.userID = 0;
        }else{
            this.userID = Payment.userID;
        };

        if (!Payment.courseID) {
            this.courseID = 0;
        }else{
            this.courseID = Payment.courseID;
        };

        if (!Payment.mpPaymentID) {
            this.mpPaymentID = 0;
        }else{
            this.mpPaymentID = Payment.mpPaymentID;
        };

        if (!Payment.authorized) {
            this.authorized = false;
        }else{
            this.authorized = Payment.authorized;
        };
    };
};

module.exports.User = class {
    constructor(user){
        if (!user.username) {
            this.username = "";
        }else{
            this.username = user.username;
        };

        if (!user.ID) {
            this.ID = 0;
        }else{
            this.ID = user.ID;
        };

        if (!user.password) {
            this.password = "";
        }else{
            this.password = user.password;
        };

        if (!user.biography) {
            this.biography = "";
        }else{
            this.biography = user.biography;
        };

        if (!user.email) {
            this.email = "";
        }else{
            this.email = user.email;
        };

        if (!user.emailCode) {
            this.emailCode = "";
        }else{
            this.emailCode = user.emailCode;
        };

        if (!user.status) {
            this.status = 1;
        }else{
            this.status = user.status;
        };

        if (!user.avatar) {
            this.avatar = "";
        }else{
            this.avatar = user.avatar;
        };

        if (!user.linkedin) {
            this.linkedin = "";
        }else{
            this.linkedin = user.linkedin;
        };

        if (!user.facebook) {
            this.facebook = "";
        }else{
            this.facebook = user.facebook;
        };

        if (!user.twitter) {
            this.twitter = "";
        }else{
            this.twitter = user.twitter;
        };

        if (!user.youtube) {
            this.youtube = "";
        }else{
            this.youtube = user.youtube;
        };

        if (!user.deleteTimestamp) {
            this.deleteTimestamp = 0;
        }else{
            this.deleteTimestamp = user.deleteTimestamp;
        };

        if (!user.deleteAccount) {
            this.deleteAccount = false;
        }else{
            this.deleteAccount = user.deleteAccount;
        };
        
    };
};