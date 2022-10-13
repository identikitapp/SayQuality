const express = require("express");
const images = express.Router();
const imgs = require("../utils/images.js");

images.param('hash', require("../middlewares/hashParam.js"));

images.get("/", (req, res) => {
    return res
        .status(423)
        .json({
            "error": {
                "code": 423,
                "message": "No se puede hacer eso."
            }
        });
});

images.get("/:hash", (req, res) => {
    res.sendFile(req.img);
});

images.post("/", (req, res) => {
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

module.exports = images;