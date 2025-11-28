const {Submission} = require("../models/index");


const fetchQuestionStatus = async (questionIds, userId) => {
    const status = [];

     for (const questionId of questionIds) {
        const result = await Submission.findAll(
            {
                where: {
                    questionId,
                    userId,
                },
                attributes : ["submissionStatus"]
            },
        );

        const statuses = result.map(r => r.submissionStatus);

        console.log("statuses: " ,statuses);
        if(statuses.includes("accepted")) {
            status.push("solved");
        }

        else if(statuses.includes("attempted")) {
            status.push("attempted");
        }

        else {
            status.push("unsolved");
        }
    };

    return status;
}

module.exports = fetchQuestionStatus;
