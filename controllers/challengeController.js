const {Challenge} = require('../models');

const challenge = async (req, res) => {
    try {
        const challenges = await Challenge.findAll();
        res.status(200).send(challenges);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
}

module.exports = challenge;
