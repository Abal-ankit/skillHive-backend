const questionModel = require("../../mongodbModels/Question");


const addQuestion = async (request, response, next) => {
    try {
        const questionData = request.body;
        
        const questionInstance = new questionModel(questionData);

        await questionInstance.save();

        response.status(201).json(questionInstance);
    } catch (error) {
        error.location = "addQuestion Controller";
        next(error);
    }
}

module.exports = addQuestion;
