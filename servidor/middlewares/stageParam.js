const sql = require("../utils/sql.js");

module.exports = function (req, res, next, stageID) {
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
                        "message": "Error interno.",
                    }
                });
        });
};