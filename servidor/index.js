require('dotenv').config();
var fs = require('fs');
var https = require('https');
var express = require('express');
const jwt = require("./utils/jwt.js");
const sql = require("./utils/sql.js");
var app = express();

app.use(express.json());

app.use((error, request, response, next) => {

    if (error.statusCode == 413) {

        return response
            .status(413)
            .json({
                "error": {
                    "code": 413,
                    "message": "El cuerpo de la peticion es muy largo, usa 5MB o menos."
                }
            });

    };

    if (error.type == 'entity.parse.failed') {
        return response
            .status(400)
            .json({
                "error": {
                    "code": 400,
                    "message": "El cuerpo de la peticion esta malformado."
                }
            });
    };

    response
        .status(500)
        .json({
            "error": {
                "code": 500,
                "message": "Ocurrio un error, intenta de nuevo mas tarde."
            }
        });


});

app.use((request, response, next) => {
    if (request.method == "GET" || request.method == "DELETE" || request.method == "HEAD") return next();

    if (request.path == "/users/pfp") {
        if (!request.get('Content-Type') || !request.get('Content-Type').toLowerCase().startsWith("image/")) {
            return response
                .status(415)
                .json({
                    "error": {
                        "code": 415,
                        "message": "El encabezado Content-Type debe ser una imagen."
                    }
                });
        } else {
            return next()
        };
    } else if (request.path == "/courses/payments") {
        return next();
    };

    if (!request.get('Content-Type') || request.get('Content-Type').toLowerCase() != "application/json") {
        response
            .status(415)
            .json({
                "error": {
                    "code": 415,
                    "message": "El encabezado Content-Type debe ser application/json."
                }
            });
    };

    return next()

});

app.use((request, response, next) => {
    if (!request.headers.authorization) {
        return next();
    };

    let header = request.headers.authorization.split(" ");

    if (header.length != 2) {

        return response
            .status(400)
            .json({
                "error": {
                    "code": 400,
                    "message": "El contenido de la cabezera \"authorization\" no es valido."
                }
            });

    };

    if (header[0] != "Bearer") {

        response
            .status(401)
            .json({
                "error": {
                    "code": 401,
                    "message": "No se admite ese tipo de tokens"
                }
            });

    } else {
        jwt.Check(header[1])
            .then((decode) => {
                sql.GetUser(decode.ID)
                    .then((users) => {
                        if (users.length == 0) {
                            return response
                                .status(500)
                                .json({
                                    "error": {
                                        "code": 500,
                                        "message": "Error interno."
                                    }
                                });
                        };

                        let user = users[0];

                        if (user.status == 3) {
                            return response
                                .status(410)
                                .json({
                                    "error": {
                                        "code": 410,
                                        "message": "Tu cuenta fue eliminada."
                                    }
                                });
                        } else if (user.status == 4) {
                            return response
                                .status(403)
                                .json({
                                    "error": {
                                        "code": 403,
                                        "message": "Tu cuenta fue suspendida."
                                    }
                                });
                        };

                        if (user.deleteAccount) {
                            let msg;
                            if (user.deleteTimestamp < Date.now()) {
                                msg = "Tu cuenta fue eliminada."
                            } else {
                                msg = "Reactiva tu cuenta."
                            };
                            return response
                                .status(410)
                                .json({
                                    "error": {
                                        "code": 410,
                                        "message": msg
                                    }
                                });
                        }

                        request.user = users[0];
                        return next();
                    })
                    .catch((e) => {
                        response
                            .status(500)
                            .json({
                                "error": {
                                    "code": 500,
                                    "message": "Error interno."
                                }
                            });
                    });

            }).catch((e) => {
                response
                    .status(401)
                    .json({
                        "error": {
                            "code": 401,
                            "message": "El token no es valido."
                        }
                    });

            });
    };

});

app.use("/users", require("./routes/users.js"));
app.use("/courses", require("./routes/courses.js"));

/*app.get('/', function (req, res) {
});*/

app.all("*", function (req, res) {
    res.status(404).json({ "status": "error", "message": "La ruta no existe." });
});

//crear servidor https
var privateKey = fs.readFileSync('sslcert/privkey.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/fullchain.pem', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.HTTPPort, process.env.HTTPHost, () => {
    console.log("Servidor en funcionamiento");
});