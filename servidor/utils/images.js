const isImage = require('is-image');
const fs = require("fs");
const shajs = require('sha.js');

//shajs('sha256').update('42').digest('hex')

module.exports.Check = (hash) => {
    if (fs.existsSync(process.env.imgPath + hash + ".png")) {
        return true;
    } else {
        return false;
    };
};

module.exports.Get = (hash) => {
    return process.env.imgPath + hash + ".png";
};

module.exports.Create = (data) => {
    //data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    if (/data:image\/(png|jpeg|jpg|webp);base64,.+/.test(data)) {

        let content = data.split(",")[1];
        let name = shajs('sha256').update(content).digest('hex');

        appendFileSync(process.env.imgPath + name + ".png", content, { "encoding": "base64" });

        if (!isImage(process.env.imgPath + name + ".png")) {
            throw new Error("Los datos enviados no son una imagen");
        } else {
            return name;
        };

    } else {
        throw new Error("Los datos enviados no pueden ser aceptados");
    };
};

