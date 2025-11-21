function twoSum(arr, target) {return true}

const fs = require('fs');
const input = fs.readFileSync('input.txt', 'utf8').trim().split('\n');
const output = fs.readFileSync('output.txt', 'utf8').trim().split('\n');
let result = '';

let t = parseInt(input[0]);
let line = 1;

while (t--) {
  const arr = input[line++].split(',').map(Number);
  const target = parseInt(input[line++]);

  const ans = twoSum(arr, target);
  const expected = output.shift().split(',').map(Number);

  if (JSON.stringify(ans) === JSON.stringify(expected)) {
    result += 'Output matched\n';
  } else {
    result += 'Wrong answer\n';
  }
}

fs.writeFileSync('result.txt', result);