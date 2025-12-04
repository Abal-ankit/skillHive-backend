const { Challenge } = require("../models");
const runUserCode = require("../utility/codeRunEnvironment.js");
const recordSubmission = require("../utility/recordSubmission.js");
const { score, matches } = require("../config/store.js");
const runCodeInDocker = require("../utility/dockerRunEnvironment.js");
const questionModel = require("../mongodbModels/Question.js");
const codeInject = require("../utility/codeInjections.js");
const fs = require("fs");
const path = require("path");
const fetchQuestionStatus = require("../utility/fetchQuestionStatus.js");
const {Submission} = require("../models/index.js");

const challenge = async (req, res, next) => {
  try {
    const { code, testCases } = req.body;
    const result = runUserCode(code, testCases);

    if (result.status === "error") return res.json(result);

    for (let a of result.results) {
      if (a.passed === false) {
        return res.json({
          status: "failed",
          message: "Some testCases are failing",
        });
      }
    }

    res.json({
      status: "success",
      message: "Congratulation! Test cases passed",
    });
  } catch (error) {
    error.location = "challenge Controller";
    next(error);
  }
};

// pending work
const dockerRun = async (req, res, next) => {
  try {
    const { questionId, language, code } = req.body;

    const questionInfo = await questionModel.findById(questionId);

    const testCases = questionInfo.testcase;
    const output = questionInfo.output;

    completeCode = codeInject(questionInfo.wholeCode[language], code);

    fs.writeFileSync(`Temp.${language}`, completeCode);

    await fs.promises.rm("input.txt", {force : true});
    await fs.promises.rm("output.txt", { force: true });
    
    testCases.map(testcase => fs.appendFileSync("input.txt", `${testcase}\n`, 'utf-8', (err) => {
      if(err) {
        throw err;
      }

      console.log("Write successful");
    }));


    output.map(data => fs.appendFileSync("output.txt", `${data}\n`, 'utf-8', (error) => {
      if(error) {
        throw error;
      }

      console.log("Write successful");
    }))

    await runCodeInDocker(language);

    
    try {
      const filePath = path.join(__dirname, "../", "result.txt");
      
      const data = fs.readFileSync(filePath, "utf8");
      const status = await recordSubmission(req, data);

      res.status(200).json({status, message : data});
    } catch (err) {
      console.error("Error reading file synchronously:", err);
      res.status(400).send("Problem occured");
    }
  } catch (error) {
    console.log("Problem occured at dockerRun Controller");
    error.location = "dockerRun Controller";
    next(error);
  } finally {
    fs.promises.rm("input.txt", {force : true});
    fs.promises.rm("output.txt", {force : true});
    fs.promises.rm("Temp.js", {force : true});
    fs.promises.rm("Temp.cpp", {force : true});
    fs.promises.rm("Temp.java", {force : true});
    fs.promises.rm("Temp.class", {force : true});
    fs.promises.rm("result.txt", {force : true});
  }
};

const getQuestionsList = async (req, res, next) => {
  try {
    const { limit, offset } = req.body;

    const result = await questionModel.find({}).skip(offset).limit(limit).lean();

    const questionIds = result.map(r => r._id.toString());
    if(req?.user?.userId) {
      const statuses = await fetchQuestionStatus(questionIds, req.user.userId);
      for(let i = 0; i < statuses.length; i++) {
        result[i].status = statuses[i];
      }
    }


    return res.status(200).json({ result, limit, offset: offset + 3 });
  } catch (error) {
    error.location = "getQuestionsList Controller";
    next(error);
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await questionModel.findOne({ _id: id }).lean();

    
    if (!result) {
      res.status(404).json({ message: "Question not found" });
      return;
    }
    
    if(req?.user?.userId) {
      const status = await fetchQuestionStatus([id], req.user.userId);
      result["status"] = status[0];
    }

    res.status(200).json(result);
  } catch (error) {
    error.location = "getQuestionById Controller";
    next(error);
  }
};

const getAllSubmissionsByQuestionId = async (req, res, next) => {
  try {
    const { id: questionId } = req.params;
    const {userId} = req.user;

    const submissions = await Submission.findAll(
      {
        where : {
          userId, questionId
        },
        attributes : ["id", "submissionStatus"],
      },
      {
        raw : true
      }
    );

    res.status(200).send(submissions);
  } catch (error) {
    error.location = "getAllSubmissionsByQuestionId Controller";
    next(error);
  }
}

const getSubmissionById = async (req, res, next) => {
  try {
    const {id : submissionId} = req.params;
  
    const result = await Submission.findOne(
      {
        where: {
          id: submissionId,
        },
        attributes: ["submittedCode", "language"],
      },
      {
        raw: true,
      }
    );
  
    res.status(200).send(result);
  } catch (error) {
    error.location = "getSubmissionById Controller";
    next(error);
  }
}

module.exports = {
  challenge,
  getQuestionsList,
  dockerRun,
  getQuestionById,
  getAllSubmissionsByQuestionId,
  getSubmissionById,
};
