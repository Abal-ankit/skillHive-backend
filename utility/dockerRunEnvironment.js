const { exec } = require("child_process");
const util = require("util");

const execAsync = util.promisify(exec);

async function runCodeInDocker(language, code) {
  // Validate input
  if (!code || typeof code !== "string") {
    throw new Error("Invalid code input");
  }

  if (code.length > 10000) {
    // Reasonable limit
    throw new Error("Code too long");
  }

  const images = {
    python: "python:3.11-slim",
    cpp: "gcc:latest",
    javascript: "node:18-slim",
  };

  if (!images[language]) {
    throw new Error("Language not supported");
  }

  // Use safer approach: write code to file instead of command line
  const dockerCommand = [
    "docker run --rm",
    "--network none", // Disable network
    "--memory 100m", // Memory limit
    "--cpus 0.5", // CPU limit
    "--user nobody", // Run as non-root
    `-w /tmp`,
    images[language],
    getExecutionCommand(language),
  ].join(" ");

  try {
    const { stdout, stderr } = await execAsync(dockerCommand, {
      timeout: 10000, // 10 second timeout
      input: code, // Pass code as stdin
    });

    return stderr ? stderr : stdout;
  } catch (err) {
    throw new Error(err.stderr || err.message);
  }
}

function getExecutionCommand(language) {
  const commands = {
    python: "python3",
    cpp: "sh -c 'echo \"$CODE\" > main.cpp && g++ main.cpp -o main && ./main'",
    javascript: "node",
  };

  return commands[language];
}

module.exports = runCodeInDocker;
