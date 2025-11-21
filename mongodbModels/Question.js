const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,
  description: String,
  sampleTestcase: [Object],
  testcase: [String],
  output: [String],
  starterCode: Object,
  wholeCode: Object,
  topic: [String],
});

const questionModel = mongoose.model('questionModel', questionSchema);

module.exports = questionModel;
