const { exec } = require("child_process");
const fs = require("fs");

const runCodeInDocker = async (language) => {
  return new Promise((resolve, reject) => {
    exec(
      `bash ./bash/${language}.sh Temp.${language} input.txt output.txt`,
      (error, stdout, stderr) => {
        if (error) {
          console.log("Error occured in in Bash execution: ", error.message);
          return reject({"message": error.message});
        }
        if (stderr) {
          return reject({ "message": stderr });
        }
        return resolve({"message": stdout });
      }
    );
  });
};

module.exports = runCodeInDocker;
