var jwt = require('jsonwebtoken');


module.exports.Create = (ID, password) => {

    let date = new Date();
    date.setMonth(date.getMonth() + 12);

    let obj = {
        ID,
        exp: date.getTime(),
        jti: password.slice(48)
    };

    if (typeof ID == "string") {
        obj.ID = parseInt(ID);
    };

    return jwt.sign(obj, process.env.jwtSecret);
};

module.exports.Check = (token) => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.jwtSecret, function (err, decoded) {
            if (err) {
                reject(new Error("No se pudo verificar el token."));
            };

            resolve(decoded);
        });
    });
};