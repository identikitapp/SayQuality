const sql = require("../utils/sql.js");

module.exports = function (req, res, next, name) {

    let okName = name.toLowerCase().replace(/-/g, " ");

    sql.GetCourseByName(okName)
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

            sql.GetStages(courses[0].ID)
                .then(async (stages) => {
                    let course = courses[0];
                    let completeStage = [];

                    try {
                        for (let index = 0; index < stages.length; index++) {
                            let s = stages[index];

                            delete s.courseID;

                            let chapters = await sql.GetChapters(s.ID);
                            for (let index2 = 0; index2 < chapters.length; index2++) {
                                const c = chapters[index2];
                                c.homework = new Boolean(c.homework);
                                delete c.stageID;
                            };

                            s.chapters = chapters;
                            completeStage.push(s);
                        };

                        course.stages = completeStage;

                        req.paramCourse = course;
                        next();
                    } catch (e) {
                        return res
                            .status(500)
                            .json({
                                "error": {
                                    "code": 500,
                                    "message": "Error interno.",
                                }
                            });
                    };
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
};