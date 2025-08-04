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

const validateEditProfileData = (req) =>{
    const allowedEditFields = ["firstName", "lastName", "emailId", "skills"];

    const isEditAllowed = Object.keys(req.body).every((fields) => allowedEditFields.includes(fields));

    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}