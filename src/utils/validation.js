const validator = require("validator");

const validateSignUpData = (req) =>{
    const {firstName, lastName, emailId, password} = req;

    if(!firstName || !lastName){
        throw new Error(" Not a valide name!!")
    }
    else if(!validator.isEmail(emailId)){
        throw new Error(" Not a valide email address!!");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error(" Please enter strong password!!")
    }
}

module.exports = {
    validateSignUpData
}