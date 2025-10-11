const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title : String,
    description : String,
    sampleTestcase : [Object],
    testcase : [Object],
    output : [Object],
    starterCode : String,
    topic : [String]
})

const questionModel = mongoose.model('questionModel', questionSchema);

module.exports = questionModel;
