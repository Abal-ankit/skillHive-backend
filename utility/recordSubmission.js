const {Submission} = require("../models/index");


const recordSubmission = async (req, result) => {
    const {questionId, code, language} = req.body;
    const {userId} = req.user;

    await Submission.create({userId, questionId, language, submittedCode : code, result});
}

module.exports = recordSubmission;
