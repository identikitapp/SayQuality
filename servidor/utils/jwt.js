var jwt = require('jsonwebtoken');


module.exports.Create = (id) => {

    let obj = { id };

    if (typeof id == "string") {
        obj.id = parseInt(id);
    };

    return jwt.sign(obj, process.env.jwtSecret);
};

module.exports.Check = (token) => {

    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.jwtSecret, function (err, decoded) {
            if (err){
                reject(new Error("No se pudo verificar el token."));
            };

            resolve(decoded);
        });
    });
};