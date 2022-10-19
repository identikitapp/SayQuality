const express = require("express");
const users = express.Router();
const sql = require("../utils/sql.js");
const email = require("../utils/email.js");
const jwt = require("../utils/jwt.js");
const images = require("../utils/images.js");
const rateLimit = require("../utils/rateLimit.js");
const { shallowEqual } = require("shallow-equal-object");
const shajs = require('sha.js');

users.param('ID', require("../middlewares/userParam.js"));

users.get("/", (req, res) => {
    let query = req.query;

    if (!query.type || typeof query.type != "string") {
        return res
            .status(422)
            .json({
                "error": {

                    "message": "Por favor ingrese un tipo de usuario."
                }
            });
    };

    let type;

    try {
        type = parseInt(query.type);
    } catch (e) {
        return res
            .status(422)
            .json({
                "error": {

                    "message": "El parametro type no es un numero valido."
                }
            });
    };

    if (type <= 0 || type > 3) {
        return res
            .status(422)
            .json({
                "error": {

                    "message": "Ingresa un tipo de usuario valido."
                }
            });
    };

    if (type == 1) {
        return res
            .status(423)
            .json({
                "error": {

                    "message": "No se puede hacer eso."
                }
            });
    };

    sql.GetUsers(type)
        .then((users) => {

            let validUsers = [];

            for (let index = 0; index < users.length; index++) {
                const user = users[index];

                if (user.status == 3) continue;

                let validUser = {
                    username: user.username,
                    id: user.ID,
                    biography: user.biography,
                    avatar: user.avatar,
                    linkedin: user.linkedin,
                    facebook: user.facebook,
                    twitter: user.twitter,
                    youtube: user.youtube,
                    type: user.type
                };

                if (!!req.user) {
                    if (user.ID == req.user.ID) {
                        validUser.email = user.email;
                    };
                };

                if (user.type == 3) {
                    user.email = user.email;
                };

                validUsers.push(validUser);
            };

            res.json({
                data: {
                    message: "Usuarios obtenidos con exito.",
                    data: validUsers
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

users.post("/", rateLimit.register, (req, res) => {
    let body = req.body;

    if (!body.username || typeof body.username != "string" || body.username.length > 55) {
        return res
            .status(422)
            .json({
                "error": {

                    "message": "El nombre de usuario es demasiado largo o no lo a ingresado.",
                    "field": "username"
                }
            });
    };

    if (!body.email || typeof body.email != "string") {
        res
            .status(422)
            .json({
                "redirect": process.env.WEB + "/register",
                "error": {
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
                    "message": "Por favor ingrese un correo electronico valido.",
                    "field": "email"
                }
            });
        return;
    };

    if (!body.password || typeof body.password != "string") {
        return res
            .status(422)
            .json({
                "error": {

                    "message": "Por favor ingrese una contraseña.",
                    "field": "password"
                }
            });
    };

    if (body.password.length > 50) {
        return res
            .status(422)
            .json({
                "error": {

                    "message": "La contraseña es muy larga.",
                    "field": "password"
                }
            });
    };

    if (body.password.length < 5) {
        return res
            .status(422)
            .json({
                "error": {

                    "message": "La contraseña es muy corta.",
                    "field": "password"
                }
            });
    };

    sql.GetUserByEmail(body.email)
        .then((users) => {
            if (users.length != 0) {
                return res
                    .status(409)
                    .json({
                        "error": {

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
                    sql.CreateLog(new sql.Log({
                        ip: req.ip,
                        email: body.email,
                        timestamp: Date.now(),
                        action: 2
                    }));

                    email.NoReply([body.email], "Su codigo de verificacion!", process.env.WEB + "/verify?code=" + emailCode)

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

                    "message": "No se ingreso el codigo.",
                }
            });
    };

    if (typeof body.code != "string") {
        return res
            .status(422)
            .json({
                "error": {

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

                            "message": "Ya se encuentra verificado.",
                        }
                    });
            };

            user.emailCode = null;
            user.status = 2;

            sql.UpdateUser(user.ID, user)
                .then(() => {

                    sql.CreateLog(new sql.Log({
                        userID: user.ID,
                        ip: req.ip,
                        timestamp: Date.now(),
                        action: 5
                    }));

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

                    "message": "Por favor ingrese un correo electronico valido.",
                    "field": "email"
                }
            });
        return;
    };

    if (!!req.user && body.email != req.user.email) {
        return res
            .status(401)
            .json({
                "error": {

                    "message": "No tienes autorizacion para hacer eso."
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

                                    "message": "Error interno.",
                                }
                            });
                    });
            } else if (user.status == 3) {
                return response
                    .status(410)
                    .json({
                        "error": {

                            "message": "Tu cuenta fue eliminada."
                        }
                    });
            } else if (user.status == 4) {
                return response
                    .status(403)
                    .json({
                        "error": {

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

                    "message": "No se ingreso el codigo.",
                }
            });
    };

    if (typeof body.code != "string") {
        return res
            .status(422)
            .json({
                "error": {

                    "message": "El codigo debe ser un string.",
                }
            });
    };

    if (!body.password) {
        return res
            .status(422)
            .json({
                "error": {

                    "message": "No se ingreso la contraseña.",
                }
            });
    };

    if (typeof body.password != "string") {
        return res
            .status(422)
            .json({
                "error": {

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
                            "message": "Debes verificar tu cuenta.",
                        }
                    });
            };

            user.emailCode = null;
            user.password = shajs('sha256').update(process.env.salt + body.password).digest('hex');

            sql.UpdateUser(user.ID, user)
                .then(() => {

                    sql.CreateLog(new sql.Log({
                        ip: req.ip,
                        userID: user.ID,
                        timestamp: Date.now(),
                        action: 7
                    }));

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

                        "message": "Error interno.",
                    }
                });
        });
});

users.post("/auth", rateLimit.login, (req, res) => {
    let body = req.body;

    if (!body.email) {
        res
            .status(422)
            .json({
                "error": {
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

                    "message": "No se ingreso la contraseña.",
                }
            });
    };

    if (typeof body.password != "string") {
        return res
            .status(422)
            .json({
                "error": {

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

                            "message": "Tu cuenta fue eliminada."
                        }
                    });
            } else if (user.status == 4) {
                return res
                    .status(403)
                    .json({
                        "error": {

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
                                    token: jwt.Create(user.ID, user.password)
                                }
                            })
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
            };

            sql.CreateLog(new sql.Log({
                userID: user.ID,
                ip: req.ip,
                timestamp: Date.now(),
                action: 1
            }));

            res
                .status(200)
                .json({
                    data: {
                        message: "Sesion iniciada con exito.",
                        token: jwt.Create(user.ID, user.password)
                    }
                })


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

users.get("/:ID", (req, res) => {

    let user = {
        username: req.paramUser.username,
        id: req.paramUser.ID,
        biography: req.paramUser.biography,
        avatar: req.paramUser.avatar,
        linkedin: req.paramUser.linkedin,
        facebook: req.paramUser.facebook,
        twitter: req.paramUser.twitter,
        youtube: req.paramUser.youtube,
        github: req.paramUser.github,
        type: req.paramUser.type
    };

    if (!!req.user) {
        if (req.paramUser.ID == req.user.ID) {
            user.email = req.paramUser.email;
        };
    };

    if (req.paramUser.type == 3) {
        user.email = req.paramUser.email;
    };

    res
        .status(200)
        .json({
            data: {
                message: "Usuario obtenido con exito.",
                user
            }
        });

});

users.patch("/:ID", rateLimit.updateUser, (req, res) => {

    let body = req.body;
    let updatedUser = { ...req.user };
    let tokenCreate = false;
    let action = 4;

    if (!req.user) {
        return res
            .status(401)
            .json({
                "error": {
                    "message": "Debes iniciar sesion para hacer eso."
                }
            });
    };

    if (req.paramUser.ID != req.user.ID) {
        return res
            .status(403)
            .json({
                "error": {
                    "message": "No tienes autorizacion para hacer eso."
                }
            });
    };

    if (shajs('sha256').update(process.env.salt + body.password).digest('hex') != req.user.password) {
        return res
            .status(403)
            .json({
                "error": {
                    "message": "La contraseña es incorrecta."
                }
            });
    };

    if (!!body.username) {
        if (typeof body.username != "string" || body.username.length > 15) {
            return res
                .status(422)
                .json({
                    "error": {
                        "message": "El nombre de usuario es demasiado largo o no lo a ingresado.",
                        "field": "username"
                    }
                });
        };
        updatedUser.username = body.username;
    };

    if (!!body.email) {
        if (typeof body.email != "string") {
            return res
                .status(422)
                .json({
                    "redirect": process.env.WEB + "/register",
                    "error": {

                        "message": "Por favor ingrese un correo electronico.",
                        "field": "email"
                    }
                });
        };

        if (body.email.length > 320 || !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(body.email)) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "Por favor ingrese un correo electronico valido.",
                        "field": "email"
                    }
                });
        };

        action = 8;
        updatedUser.email = body.email;
    };


    if (!!body.newPassword) {
        if (typeof body.newPassword != "string") {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "Por favor ingrese una contraseña.",
                        "field": "password"
                    }
                });
        };

        if (body.newPassword.length > 50) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "La contraseña es muy larga.",
                        "field": "password"
                    }
                });
        };

        if (body.newPassword.length < 5) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "La contraseña es muy corta.",
                        "field": "password"
                    }
                });
        };

        action = 6;
        tokenCreate = true;
        updatedUser.password = shajs('sha256').update(process.env.salt + body.newPassword).digest('hex');
    };


    if (!!body.biography) {
        if (typeof body.biography != "string" || body.biography.length > 2000) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "La biografia es demasiado larga o no lo a ingresado.",
                        "field": "biography"
                    }
                });
        };
        updatedUser.biography = body.biography;
    };

    if (!!body.avatar) {
        if (typeof body.avatar != "string" || body.avatar.length != 64) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "El avatar es invalido.",
                        "field": "biography"
                    }
                });
        };

        if (!images.Check(body.avatar)) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "El avatar es invalido.",
                        "field": "avatar"
                    }
                });
        };

        updatedUser.avatar = body.avatar;
    };

    if (!!body.linkedin) {
        if (typeof body.linkedin != "string" || body.linkedin.length > 80) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "El linkedin es invalido o no lo ha ingresado.",
                        "field": "linkedin"
                    }
                });
        };
        updatedUser.linkedin = body.linkedin;
    };

    if (!!body.facebook) {
        if (typeof body.facebook != "string" || body.facebook.length > 50) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "El facebook es invalido o no lo ha ingresado.",
                        "field": "facebook"
                    }
                });
        };
        updatedUser.facebook = body.facebook;
    };

    if (!!body.twitter) {
        if (typeof body.twitter != "string" || body.twitter.length > 50) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "El twitter es invalido o no lo ha ingresado.",
                        "field": "twitter"
                    }
                });
        };
        updatedUser.twitter = body.twitter;
    };

    if (!!body.youtube) {
        if (typeof body.youtube != "string" || body.youtube.length > 256) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "El canal de youtube es invalido o no lo ha ingresado.",
                        "field": "youtube"
                    }
                });
        };
        updatedUser.youtube = body.youtube;
    };

    if (!!body.github) {
        if (typeof body.github != "string" || body.github.length > 39) {
            return res
                .status(422)
                .json({
                    "error": {

                        "message": "El github es invalido o no lo ha ingresado.",
                        "field": "github"
                    }
                });
        };
        updatedUser.github = body.github;
    };

    if (shallowEqual(updatedUser, req.paramUser)) {
        return res
            .status(200)
            .json({
                data: {
                    message: "No hay cambios en el usuario."
                }
            });
    };

    if (updatedUser.email == body.email) {
        sql.GetUserByEmail(body.email)
            .then((users) => {
                if (users.length != 0) {
                    return res
                        .status(409)
                        .json({
                            "error": {

                                "message": "El correo electrinico ya esta en uso."
                            }
                        });
                };

                updatedUser.emailCode = shajs('sha256').update(process.env.salt + Date.now().toString() + body.email).digest('hex');
                updatedUser.status = 1;

                updateUser(req, res, updatedUser, false, action);
            })
            .catch((e) => {
                res
                    .status(500)
                    .json({
                        "error": {

                            "message": "Error interno."
                        }
                    });
            });
    } else {
        updateUser(req, res, updatedUser, tokenCreate, action);
    };

});

users.delete("/:ID", (req, res) => {

    if (!req.user) {
        return res
            .status(401)
            .json({
                "error": {

                    "message": "Debes iniciar sesion para hacer eso."
                }
            });
    };

    if (req.paramUser.ID != req.user.ID) {
        return res
            .status(403)
            .json({
                "error": {

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

            sql.CreateLog(new sql.Log({
                ip: req.ip,
                userID: req.user.ID,
                timestamp: Date.now(),
                action: 9
            }));

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

                        "message": "Error interno.",
                    }
                });
        });

});

function updateUser(req, res, user, token = true, action) {
    sql.UpdateUser(user.ID, user)
        .then(() => {

            let data = {
                message: "Usuario actualizado con exito."
            };

            if (token) {
                data.token = jwt.Create(user.ID, user.password);
            } else {
                email.NoReply([user.email], "Su codigo de verificacion!", process.env.WEB + "/verify?code=" + user.emailCode)
            };

            sql.CreateLog(new sql.Log({
                ip: req.ip,
                userID: user.ID,
                timestamp: Date.now(),
                action
            }));

            res
                .status(200)
                .json({ data });
        })
        .catch((e) => {
            res
                .status(500)
                .json({
                    "error": {

                        "message": "Error interno."
                    }
                });
        });
};

module.exports = users;