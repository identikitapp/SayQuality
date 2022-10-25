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
    let name = shajs('sha256').update(content).digest('hex');
    let path = process.env.imgPath + "/" + name + ".png";

    if (fs.existsSync(path)) {
        return {
            code: 200,
            name
        };
    };

    fs.appendFileSync(path, content, { encoding: "binary" });

    if (!isImage(path)) {
        fs.unlinkSync(path);
        throw new Error("Los datos enviados no son una imagen");
    } else {
        return {
            code: 201,
            name
        };
    };
};

