const sql = require("../utils/sql.js");

module.exports = function (req, res, next, chapterID) {
    sql.GetChapters(chapterID)
        .then((chapters) => {
            if (chapters.length == 0) {
                return res
                    .status(404)
                    .json({
                        "error": {
                            
                            "message": "El curso no existe."
                        }
                    });
            };

            let chapter = chapters[0];

            chapter.homework = new Boolean(chapter.homework);

            req.paramChapter = chapters[0];
            next();
        })
        .catch((e) => {
            return res
                .status(500)
                .json({
                    "error": {
                        
                        "message": "Error interno.",
                    }
                });
        });
};