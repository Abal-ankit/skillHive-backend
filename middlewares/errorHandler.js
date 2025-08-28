const handleError = (err, req, res, next) => {
    console.log(`Error at ${err.location}: `, err.message);
    res.status(500).json({"Error" : err.message});
}

module.exports = handleError;
