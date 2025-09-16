const { User } = require("../models")

const isValidUser = async (id) => {
    try {
        const user = await User.findByPk(id);
    
        if(!user)
            return null;
    
        return user;

    } catch (error) {
        console.log("[ERROR] occured at isValidUser middleware: ", error.message);
        return null;
    }
}

module.exports = isValidUser;
