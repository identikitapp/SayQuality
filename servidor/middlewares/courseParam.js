const sql = require("../utils/sql.js");

module.exports = function (req, res, next, name) {
    sql.GetCourseByName(name)
        .then((courses) => {
            if (courses.length == 0) {
                return res
                    .status(404)
                    .json({
                        "error": {
                            "code": 404,
                            "message": "El curso no existe."
                        }
                    });
            };

            req.paramCourse = courses[0];
            next();
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
}