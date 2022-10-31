const isImage = require('is-image');
const fs = require("fs");
const shajs = require('sha.js');

module.exports.Check = (hash) => {
    try {
        return fs.existsSync(process.env.imgPath + "/" + hash + ".png");
    } catch (e) {
        return false;
    };
};

module.exports.Get = (hash) => {
    return process.env.imgPath + "/" + hash + ".png";
};

module.exports.Create = (content) => {

    let regex = /^data:.+\/(.+);base64,(.*)$/;
    let matches = content.match(regex);

    if(matches.length != 3){
        throw new Error("Los datos enviados no son Data URLs");
    };

    let data = matches[2];
    let buffer = Buffer.from(data, 'base64');

    let name = shajs('sha256').update(buffer.toString("binary")).digest('hex');
    let path = process.env.imgPath + "/" + name + ".png";

    if (fs.existsSync(path)) {
        return {
            code: 200,
            name,
            message: "La imagen ya existe."
        };
    };

    fs.appendFileSync(path, buffer);

    if (!isImage(path)) {
        fs.unlinkSync(path);
        throw new Error("Los datos enviados no son una imagen");
    } else {
        return {
            code: 201,
            name,
            message: "Imagen creada con exito."
        };
    };
};

