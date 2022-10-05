const express = require("express");
const courses = express.Router();
const sql = require("../utils/sql.js");
const email = require("../utils/email.js");
const jwt = require("../utils/jwt.js");
const images = require("../utils/images.js");
const shajs = require('sha.js');
const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: process.env.mpToken,
});

courses.param('name', require("../middlewares/courseParam.js"));

courses.get("/", (req, res) => {
    sql.GetCourses()
        .then((courses) => {
            res
                .status(200)
                .json({
                    data: {
                        message: "Cursos obtenido con exito.",
                        courses
                    }
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

courses.get("/:name", (req, res) => {
    res
        .status(200)
        .json({
            data: {
                message: "Curso obtenido con exito.",
                course: req.paramCourse
            }
        });
});

courses.post("/payments", (req, res) => {
    let body = req.body;

    if (body.type == "test") {
        return res
            .status(200)
            .json({
                data: {
                    message: "👍."
                }
            });
    };

    if (body.type != "payment") {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "Solo se acepta el tipo de notificación payment."
                }
            });
    };

    if (body.action != "payment.created" && body.action != "payment.updated") {
        return res
            .status(422)
            .json({
                "error": {
                    "code": 422,
                    "message": "No se puede aceptar esa accion."
                }
            });
    };

    mercadopago.payment
        .get(body.data.id)
        .then((payment) => {
            let userID = payment.body.external_reference.split(":")[0];
            let courseID = payment.body.external_reference.split(":")[1];
            let authorized = false;

            if (payment.body.status == "approved") {
                authorized = true;
            };

            if (body.action == "payment.created") {

                sql.CreatePayment(new sql.Payment({
                    userID,
                    courseID,
                    authorized,
                    mpPaymentID: payment.body.id
                }))
                    .then(() => {
                        res
                            .status(201)
                            .json({
                                data: {
                                    message: "Pago registrado con exito."
                                }
                            });
                    })
                    .catch(function (error) {
                        return res
                            .status(500)
                            .json({
                                "error": {
                                    "code": 500,
                                    "message": "Error interno.",
                                }
                            });
                    });

            } else if (body.action == "payment.updated") {

                sql.UpdatePaymentByMPID(payment.body.id, new sql.Payment({
                    userID,
                    courseID,
                    authorized
                }))
                    .then(() => {
                        res
                            .status(200)
                            .json({
                                data: {
                                    message: "Pago actualizado con exito."
                                }
                            });
                    })
                    .catch(function (error) {
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
        })
        .catch(function (error) {
            if (error.status == 404) {
                return res
                    .status(400)
                    .json({
                        "error": {
                            "code": 400,
                            "message": "El pago es falso.",
                        }
                    });
            }

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

courses.get("/:name/payment", (req, res) => {

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

    let preference = {
        "auto_return": "all",
        "external_reference": req.user.ID.toString() + ":" + req.paramCourse.ID.toString(),
        "back_urls": {
            "success": process.env.WEB + "/courses/" + req.paramCourse.name,
            "pending": process.env.WEB + "/courses/" + req.paramCourse.name,
            "failure": process.env.WEB + "/courses/" + req.paramCourse.name
        },
        "items": [
            {
                "id": req.paramCourse.ID.toString(),
                "title": req.paramCourse.name,
                "description": req.paramCourse.description,
                "picture_url": process.env.HTTPHost + "/images/" + req.paramCourse.picture,
                "category_id": "Online Course",
                "quantity": 1,
                "currency_id": req.paramCourse.currency,
                "unit_price": req.paramCourse.price
            },
        ]
    };

    mercadopago.preferences
        .create(preference)
        .then(function (response) {
            res
                .status(200)
                .json({
                    data: {
                        message: "Pago obtenido con exito.",
                        preference: response.body.id
                    }
                });
        })
        .catch(function (error) {
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

module.exports = courses;