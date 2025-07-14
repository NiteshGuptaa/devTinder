const mongoose = require("mongoose");

// const {Schema} = mongoose;


const userSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    emailId: {type: String},
    password: {type: String},
    gender: {type: String}
})

// create models
const User = mongoose.model("User", userSchema);

// export models
module.exports = User;

//? OR directally export in one line
// module.exports = mongoose.model("User", userSchema);