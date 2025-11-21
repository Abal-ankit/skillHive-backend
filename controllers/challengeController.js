const { Challenge } = require("../models");
const runUserCode = require("../utility/codeRunEnvironment.js");
const recordSubmission = require("../utility/recordSubmission.js");
const { score, matches } = require("../config/store.js");
const runCodeInDocker = require("../utility/dockerRunEnvironment.js");
const questionModel = require("../mongodbModels/Question.js");
const codeInject = require("../utility/codeInjections.js");
const fs = require("fs");
const path = require("path");

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

    fs.unlinkSync("input.txt");
    fs.unlinkSync("output.txt")
    
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

    const result = await runCodeInDocker(language);

    
    try {
      const filePath = path.join(__dirname, "../", "result.txt");
      
      const data = fs.readFileSync(filePath, "utf8");
      recordSubmission(req, data);

      res.status(200).send(data);
    } catch (err) {
      console.error("Error reading file synchronously:", err);
      res.status(400).send("Problem occured");
    }
  } catch (error) {
    console.log("Problem occured at dockerRun Controller");
    error.location = "dockerRun Controller";
    next(error);
  }
};

const getQuestionsList = async (req, res, next) => {
  try {
    const { limit, offset } = req.body;

    const result = await questionModel.find({}).skip(offset).limit(limit);

    return res.status(200).json({ result, limit, offset: offset + 3 });
  } catch (error) {
    error.location = "getQuestionsList Controller";
    next(error);
  }
};

const getQuestionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await questionModel.findOne({ _id: id });
    if (!result) {
      res.status(404).json({ message: "Question not found" });
      return;
    }

    res.status(200).json(result);
  } catch (error) {
    error.location = "getQuestionById Controller";
    next(error);
  }
};

module.exports = { challenge, getQuestionsList, dockerRun, getQuestionById };
