const sql = require("../utils/sql.js");
const jwt = require("../utils/jwt.js");

module.exports = (request, cb) => {
    if (!request.headers.authorization) {
        request.AuthErr = "Debes iniciar sesion para hacer eso.";
        return cb(request);
    };

    let header = request.headers.authorization.split(" ");

    if (header.length != 2) {
        request.AuthErr = "El contenido de la cabezera \"authorization\" no es valido.";
        return cb(request);
    };

    if (header[0] != "Bearer") {
        request.AuthErr = "No se admite ese tipo de tokens";
        return cb(request);
    } else {
        jwt.Check(header[1])
            .then((decode) => {
                sql.GetUser(decode.ID)
                    .then((users) => {
                        if (users.length == 0) {
                            request.Err = "Error interno";
                            return cb(request);
                        };

                        let user = users[0];

                        if (user.status == 3) {
                            request.AuthErr = "Tu cuenta fue eliminada";
                            return cb(request);
                        } else if (user.status == 4) {
                            request.AuthErr = "Tu cuenta fue suspendida";
                            return cb(request);
                        };
                        if (user.deleteAccount) {
                            if (user.deleteTimestamp < Date.now()) {
                                request.AuthErr = "Tu cuenta fue eliminada."
                            } else {
                                request.AuthErr = "Reactiva tu cuenta."
                            };
                            return cb(request);
                        }

                        request.user = users[0];
                        return cb(request);
                    })
                    .catch((e) => {
                        request.Err = "Error interno";
                        return cb(request);
                    });

            }).catch((e) => {
                request.AuthErr = "El token no es valido";
                return cb(request);
            });
    };

};