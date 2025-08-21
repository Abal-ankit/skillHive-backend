const { VM } = require("vm2");

function runUserCode(userCode, testCases) {
  try {
    const vm = new VM({
      timeout: 1000,
      sandbox: {},
    });

    const wrappedCode = `( ${userCode} )`; // wrap user code
    const solutionFn = vm.run(wrappedCode);

    let results = [];

    for (const test of testCases) {
      let output = solutionFn(...test.input);
      let passed = JSON.stringify(output) === JSON.stringify(test.expected);
      results.push({
        input: test.input,
        expected: test.expected,
        output,
        passed,
      });
    }

    return { status: "success", results };
  } catch (err) {
    return { status: "error", message: err.message };
  }
}

module.exports = runUserCode; // ✅ Export function
