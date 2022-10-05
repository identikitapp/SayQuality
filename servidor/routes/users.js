const express = require("express");
const users = express.Router();
const sql = require("../utils/sql.js");
const email = require("../utils/email.js");
const jwt = require("../utils/jwt.js");
const images = require("../utils/images.js");
const shajs = require('sha.js');

users.param('ID', require("../middlewares/userParam.js"));

users.post("/", (req, res) => {
    let body = req.body;

    if (!body.username || typeof body.username != "string" || body.username.length > 15) {
        res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "El nombre de usuario es demasiado largo o no lo a ingresado.",
                    "field": "username"
                }
            });
        return;
    };

    if (!/^(\w|ñ|ç)+$/i.test(body.username)) {
        res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "El nombre de usuario solo puede tener letras de la A-Z o numero del 0-9.",
                    "field": "username"
                }
            });
        return;
    };

    if (!body.email || typeof body.email != "string") {
        res
            .status(422)
            .json({
                "redirect": process.env.WEB + "/register",
                "error": {
                    "code": 422,
                    "message": "Por favor ingrese un correo electronico.",
                    "field": "email"
                }
            });
        return;
    };

    if (body.email.length > 320 || !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(body.email)) {
        res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "Por favor ingrese un correo electronico valido.",
                    "field": "email"
                }
            });
        return;
    };

    if (!body.password || typeof body.password != "string") {
        res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "Por favor ingrese una contraseña.",
                    "field": "password"
                }
            });
        return;
    };

    sql.GetUserByEmail(body.email)
        .then((users) => {
            if (users.length != 0) {
                return res
                    .status(409)
                    .json({
                        "error": {
                            "code": 409,
                            "message": "El correo electrinico ya esta en uso."
                        }
                    });
            }

            let emailCode = shajs('sha256').update(process.env.salt + Date.now().toString() + body.email).digest('hex')

            sql.CreateUser(new sql.User({
                email: body.email,
                username: body.username,
                password: shajs('sha256').update(process.env.salt + body.password).digest('hex'),
                emailCode
            }))
                .then(() => {

                    email.NoReply([email], "Su codigo de verificacion!", process.env.WEB + "/verify?code=" + emailCode)

                    res
                        .status(201)
                        .json({
                            data: {
                                message: "Le hemos enviado un email para que verifique su cuenta."
                            }
                        })
                })
                .catch((e) => {
                    res
                        .status(500)
                        .json({
                            "error": {
                                "code": 500,
                                "message": "Error interno."
                            }
                        });
                });
        })
        .catch((e) => {
            res
                .status(500)
                .json({
                    "error": {
                        "code": 500,
                        "message": "Error interno."
                    }
                });
        });


});

users.patch("/auth/verify", (req, res) => {
    let body = req.body;

    if (!body.code) {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "No se ingreso el codigo.",
                }
            });
    };

    if (typeof body.code != "string") {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "El codigo debe ser un string.",
                }
            });
    };

    sql.GetUserByCode(body.code)
        .then((users) => {
            if (users.length == 0) {
                return res
                    .status(422)
                    .json({
                        "error": {
                            "code": 422,
                            "message": "El codigo ingresado no es valido.",
                        }
                    });
            };

            user = users[0];

            if (user.status == 2) {
                return res
                    .status(409)
                    .json({
                        "error": {
                            "code": 409,
                            "message": "Ya se encuentra verificado.",
                        }
                    });
            };

            user.emailCode = null;
            user.status = 2;

            sql.UpdateUser(user.ID, user)
                .then(() => {
                    res
                        .status(200)
                        .json({
                            data: {
                                message: "Su cuenta fue verificada con exito."
                            }
                        })
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
});

users.post("/auth/recovery", (req, res) => {
    let body = req.body;

    if (!body.email) {
        res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "Por favor ingrese un correo electronico.",
                    "field": "email"
                }
            });
        return;
    };

    if (typeof body.email != "string") {
        res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "Por favor ingrese un correo electronico valido.",
                    "field": "email"
                }
            });
        return;
    };

    sql.GetUserByEmail(body.email)
        .then((users) => {
            if (users.length == 0) {
                res
                    .status(401)
                    .json({
                        "error": {
                            "code": 401,
                            "message": "El correo electronico no esta registrado.",
                            "field": "email"
                        }
                    });
                return;
            };

            let user = users[0];

            if (user.status == 1) {
                email.NoReply([user.email], "Su codigo de verificacion!", process.env.WEB + "/verify?code=" + user.emailCode)
                res
                    .status(200)
                    .json({
                        data: {
                            message: "Se volvio a enviar su codigo de verificacion."
                        }
                    })
            } else if (user.status == 2) {
                let emailCode = shajs('sha256').update(process.env.salt + Date.now() + body.email).digest('hex');

                user.emailCode = emailCode;

                sql.UpdateUser(user.ID, user)
                    .then(() => {
                        email.NoReply([user.email], "Restablece tu contraseña!", process.env.WEB + "/recovery?code=" + user.emailCode)
                        res
                            .status(200)
                            .json({
                                data: {
                                    message: "Se envio un correo para el restablecimiento de su contraseña."
                                }
                            })
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
            } else if (user.status == 3) {
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




});

users.patch("/auth/reset", (req, res) => {
    let body = req.body;

    if (!body.code) {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "No se ingreso el codigo.",
                }
            });
    };

    if (typeof body.code != "string") {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "El codigo debe ser un string.",
                }
            });
    };

    if (!body.password) {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "No se ingreso la contraseña.",
                }
            });
    };

    if (typeof body.password != "string") {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "La contraseña debe ser un string.",
                }
            });
    };

    sql.GetUserByCode(body.code)
        .then((users) => {
            if (users.length == 0) {
                return res
                    .status(422)
                    .json({
                        "error": {
                            "code": 422,
                            "message": "El codigo ingresado no es valido.",
                        }
                    });
            };

            user = users[0];

            if (user.status == 1) {
                return res
                    .status(409)
                    .json({
                        "error": {
                            "code": 401,
                            "message": "Debes verificar tu cuenta.",
                        }
                    });
            };

            user.emailCode = null;
            user.password = shajs('sha256').update(process.env.salt + body.password).digest('hex');

            sql.UpdateUser(user.ID, user)
                .then(() => {
                    res
                        .status(200)
                        .json({
                            data: {
                                message: "Su contraseña fue restablecida con exito."
                            }
                        })
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
});

users.post("/auth", (req, res) => {
    let body = req.body;

    if (!body.email) {
        res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "Por favor ingrese un correo electronico.",
                    "field": "email"
                }
            });
        return;
    };

    if (typeof body.email != "string") {
        res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "Por favor ingrese un correo electronico valido.",
                    "field": "email"
                }
            });
        return;
    };


    if (!body.password) {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "No se ingreso la contraseña.",
                }
            });
    };

    if (typeof body.password != "string") {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "La contraseña debe ser un string.",
                }
            });
    };

    sql.GetUserByEmail(body.email)
        .then((users) => {
            if (users.length == 0) {
                res
                    .status(401)
                    .json({
                        "error": {
                            "code": 401,
                            "message": "El correo electronico no esta registrado.",
                            "field": "email"
                        }
                    });
                return;
            };

            let user = users[0];

            let password = shajs('sha256').update(process.env.salt + body.password).digest('hex');

            if (password != user.password) {
                res
                    .status(401)
                    .json({
                        "error": {
                            "code": 401,
                            "message": "La contraseña es incorrecta.",
                            "field": "password"
                        }
                    });
                return;
            };

            if (user.status == 3) {
                return res
                    .status(410)
                    .json({
                        "error": {
                            "code": 410,
                            "message": "Tu cuenta fue eliminada."
                        }
                    });
            } else if (user.status == 4) {
                return res
                    .status(403)
                    .json({
                        "error": {
                            "code": 403,
                            "message": "Tu cuenta fue suspendida."
                        }
                    });
            };

            if (user.deleteAccount) {
                user.deleteAccount = false;
                return sql.UpdateUser(user.ID, user)
                    .then(() => {
                        res
                            .status(200)
                            .json({
                                data: {
                                    message: "Sesion iniciada y cuenta reactivada con exito.",
                                    token: jwt.Create(user.ID)
                                }
                            })
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
            };

            res
                .status(200)
                .json({
                    data: {
                        message: "Sesion iniciada con exito.",
                        token: jwt.Create(user.ID)
                    }
                })


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
});

users.get("/:ID", (req, res) => {

    //req.paramUser
    let user = {
        username: req.paramUser.username,
        id: req.paramUser.ID,
        biography: req.paramUser.biography,
        avatar: req.paramUser.avatar,
        linkedin: req.paramUser.linkedin,
        facebook: req.paramUser.facebook,
        twitter: req.paramUser.twitter,
        youtube: req.paramUser.youtube
    };

    if (!!req.user) {
        if (req.paramUser.ID == req.user.ID) {
            user.email = req.paramUser.email;
        };
    };

    res
        .status(200)
        .json({
            data: {
                message: "Usuario obtenido con exito.",
                user
            }
        })

});

users.delete("/:ID", (req, res) => {

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

    if (req.paramUser.ID != req.user.ID) {
        return res
            .status(403)
            .json({
                "error": {
                    "code": 403,
                    "message": "No tienes autorizacion para hacer eso."
                }
            });
    };

    let date = new Date();
    date.setMonth(date.getMonth() + 1);

    req.user.deleteTimestamp = date.getTime();
    req.user.deleteAccount = true;

    sql.UpdateUser(req.user.ID, req.user)
        .then(() => {
            res
                .status(200)
                .json({
                    data: {
                        message: "La cuenta sera eliminada en un mes.",
                        deleteTimestamp: date.getTime()
                    }
                })
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

});

module.exports = users;