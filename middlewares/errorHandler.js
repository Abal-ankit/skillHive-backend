const handleError = (err, req, res, next) => {
    console.log(`[!ERROR] Error at ${err.location}: `, err.message);
    res.status(401).json({"Error" : err.message});
}

module.exports = handleError;
