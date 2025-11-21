function codeInject(originalCode, functionCode) {
    return originalCode.replace("// {{Add function}}", functionCode);
}

module.exports = codeInject;
