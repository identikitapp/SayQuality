const imgs = require("../utils/images.js");

module.exports = (req, res, next, hash) => {
    if (imgs.Check(hash)) {
        req.img = imgs.Get(hash);
        next();
    } else {
        return res
            .status(404)
            .json({
                "error": {
                    "code": 404,
                    "message": "La imagen no existe."
                }
            });
    };
};