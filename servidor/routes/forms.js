const express = require("express");
const forms = express.Router();
const formsList = {
    0: "Problemas o dudas con mi cuenta",
    1: "Problemas o dudas con mi compra",
    2: "Problemas o dudas de seguridad",
    3: "Contacto legal",
    4: "Contacto empresarial",
    5: "Entrega de tarea",
    6: "Otro"
};
const sql = require("../utils/sql.js");
const email = require("../utils/email.js");
const jwt = require("../utils/jwt.js");
const images = require("../utils/images.js");
const shajs = require('sha.js');

forms.get("/", (req, res) => {
    res.json({
        data: {
            message: "Formularios obtenidos con exito.",
            data: formsList
        }
    });
});

forms.post("/", async (req, res) => {
    let body = req.body;
    let userEmail;

    if (!req.body.form || req.body.form < 0 || req.body.form > 5) {
        return res
            .status(422)
            .json({
                "error": {
                    
                    "message": "Ingresa un formulario valido.",
                    "field": "form"
                }
            });
    };

    if (!!req.user && !!req.body.email) {
        return res
            .status(409)
            .json({
                "error": {
                    
                    "message": "No puedes colocar un email diferente al de tu usuario.",
                    "field": "email"
                }
            });
    };

    if (!req.user) {
        if (!req.body.email || typeof body.email != "string") {
            return res
                .status(422)
                .json({
                    "error": {
                        
                        "message": "Por favor ingrese un correo electronico.",
                        "field": "email"
                    }
                });
        } else {
            userEmail = req.body.email;
        };
    } else {
        userEmail = req.user.email;
    };

    if (!body.subject || typeof body.subject != "string") {
        return res
            .status(422)
            .json({
                "error": {
                    
                    "message": "Por favor ingrese un asunto.",
                    "field": "subject"
                }
            });
    };

    if (body.subject > 30) {
        return res
            .status(422)
            .json({
                "error": {
                    
                    "message": "El asunto es demasiado largo.",
                    "field": "subject"
                }
            });
    };

    if (!body.text || typeof body.text != "string") {
        return res
            .status(422)
            .json({
                "error": {
                    
                    "message": "Por favor ingrese un cuerpo.",
                    "field": "body"
                }
            });
    };

    if (body.text > 5000) {
        return res
            .status(422)
            .json({
                "error": {
                    
                    "message": "El cuerpo es demasiado largo, si es necesario coloque enlaces a otros documentos.",
                    "field": "body"
                }
            });
    };

    let text = `email: ${userEmail}\nsubject: ${body.subject}\ntext: ${body.text}`;

    //"Soy el representante legal de la persona u organizacion que contacta"
    if (req.body.form == 3) {
        text = `lawyer: ${body.lawyer}\n` + text;
        if (typeof body.lawyer != "boolean") {
            return res
                .status(422)
                .json({
                    "error": {
                        
                        "message": "Verifica si eres un representante.",
                        "field": "lawyer"
                    }
                });
        };
    };

    if (req.body.form != 3 && typeof body.lawyer == "boolean") {
        return res
            .status(422)
            .json({
                "error": {
                    
                    "message": "Esta opcion no requiere un representante.",
                    "field": "lawyer"
                }
            });
    };

    email.NoReply([process.env.contactEmail], formsList[req.body.form], text);

    return res
        .status(201)
        .json({
            data: {
                message: "Formulario enviado con exito."
            }
        });
});

module.exports = forms;