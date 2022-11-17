const sql = require("../utils/sql.js");

module.exports = function (req, res, next, stageID) {
    sql.GetStage(stageID)
        .then((stages) => {
            if(stages.length == 0){
                return res
                .status(404)
                .json({
                    "error": {
                        "message": "La unidad no existe."
                    }
                });
            };

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