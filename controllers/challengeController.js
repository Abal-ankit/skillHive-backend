const {Challenge} = require('../models');
const runUserCode = require("../utility/codeRunEnvironment.js");
const {score, matches} = require("../config/store.js");

const challenge = async (req, res) => {
   
   try {
      const { code, testCases, playerId } = req.body;
      const result = runUserCode(code, testCases);
   
      if(result.status === "error")
         return res.json(result);
   
      for(let a of result.results) {
         if(a.passed === false) {
            return res.json({status : "failed", message : "Some testCases are failing"});
         }
      }
   
      let yourScore = (score.get(playerId) || 0) + 1;
      score.set(playerId, yourScore);
   
   
      console.log(playerId, yourScore);
      res.json({status : "success", message : "Congratulation! Test cases passed"});
      
   } catch (error) {
      error.location = "challenge Controller";
      next(error);
   }
}

const getQuestionsList = async (req, res) => {
   try {
      const {limit, offset} = req.body;
      const result = await Challenge.findAll({offset, limit});
      
      return res.status(200).json({result, limit, offset : offset + 3});
   } catch (error) {
      error.location = "getQuestionsList Controller";
      next(error);
   }
}

module.exports = { challenge, getQuestionsList };
