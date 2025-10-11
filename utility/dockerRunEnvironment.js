const { exec } = require("child_process");
const fs = require("fs");
const codeInject = require("./codeInjections");

const runCodeInDocker = async (language, code) => {
  const originalCode = `#include<bits/stdc++.h>
using namespace std;

// {{ADD_FUNCTION}}

int main() {
   int a = 10, b = 20;

   ofstream file("/home/result.txt");
   
   if(!file.is_open()) {
    cerr << "Error: Unable to open file!" << endl;
    return 1;
  }
  
  file << add(a, b);

    file.close();
   return 0;
}`;
  code = codeInject(originalCode, code);
  fs.writeFileSync(`Temp.${language}`, code);

  return new Promise((resolve, reject) => {
    exec(
      `bash ./bash/${language}.sh Temp.${language}`,
      (error, stdout, stderr) => {
        if (error) {
          console.log("Error occured in promise: ", error.message);
          return reject(`Error: ${error.message}`);
        }
        if (stderr) {
          console.log("Error occured in promise: ", stderr);
          return reject(`stderr: ${stderr}`);
        }
        console.log("Happiness occured in promise: ", stdout);
        return resolve(stdout);
      }
    );
  });
};

module.exports = runCodeInDocker;
