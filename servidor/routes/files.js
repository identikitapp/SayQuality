const express = require("express");
const images = express.Router();
const sql = require("../utils/sql.js");
const fs = require("fs");
const imgs = require("../utils/images.js");

images.param('hash', require("../middlewares/hashParam.js"));

images.param('stageID', (req, res, next, stageID) => {
    sql.GetStage(stageID)
        .then((stages) => {
            req.paramStage = stages[0];
            next();
        })
        .catch((error) => {
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

images.param('file', (req, res, next, file) => {
    req.file = file;
    next();
});

images.get(["/", "/images"], (req, res) => {
    return res
        .status(423)
        .json({
            "error": {
                "code": 423,
                "message": "No se puede hacer eso."
            }
        });
});

images.get("/images/:hash", (req, res) => {
    res.sendFile(req.img);
});

images.post("/images", (req, res) => {
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

    try {
        let { name, code } = imgs.Create(req.body);
        res
            .status(code)
            .json({
                data: {
                    message: "Imagen creada con exito.",
                    name
                }
            });
    } catch (e) {
        return res
            .status(415)
            .json({
                "error": {
                    "code": 415,
                    "message": e.message
                }
            });
    };
});

images.get("/:stageID", (req, res) => {
    if (fs.existsSync(process.env.filesPath + "/" + req.paramStage.ID + ".pdf")) {
        res.sendFile(process.env.filesPath + "/" + req.paramStage.ID + ".pdf");
    } else {
        return res
            .status(404)
            .json({
                "error": {
                    "code": 404,
                    "message": "El archivo no existe."
                }
            });
    };
});

images.get("/:stageID/:file", (req, res) => {
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

    sql.GetPayment(req.user.ID, req.paramStage.courseID)
        .then((payments) => {
            if (payments.length == 0) {
                return res
                    .status(401)
                    .json({
                        "error": {
                            "code": 401,
                            "message": "Debes comprar el producto."
                        }
                    });
            };

            if (!payments[0].authorized) {
                return res
                    .status(401)
                    .json({
                        "error": {
                            "code": 401,
                            "message": "Debes comprar el producto."
                        }
                    });
            };

            if (fs.existsSync(process.env.filesPath + "/" + req.paramStage.ID + "/" + req.file + ".pdf")) {
                res.sendFile(process.env.filesPath + "/" + req.paramStage.ID + "/" + req.file + ".pdf");
            } else {
                return res
                    .status(404)
                    .json({
                        "error": {
                            "code": 404,
                            "message": "El archivo no existe."
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

module.exports = images;