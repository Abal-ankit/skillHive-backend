const {Submission} = require("../models/index");


const recordSubmission = async (req, result) => {
    const {questionId, code, language} = req.body;
    const {userId} = req.user;
    const output = result.trim().split("\n").every(res => res === "Output matched");
    await Submission.create({userId, questionId, language, submittedCode : code, result, submissionStatus : output ? "accepted" : "attempted"});

    return output === true ? "success" : "failed";
}

module.exports = recordSubmission;  
