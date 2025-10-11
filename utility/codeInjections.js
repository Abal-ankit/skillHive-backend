function codeInject(originalCode, functionCode) {
    return originalCode.replace("// {{ADD_FUNCTION}}", functionCode);
}

module.exports = codeInject;
