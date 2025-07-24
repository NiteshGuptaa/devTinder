const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// const {Schema} = mongoose;

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalide email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
      max: 60,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valide!!");
        }
      },
    },
    about: {
      type: String,
      default: "This is the defualt about the user!!",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "dev@TinderSecretKey", {
    expiresIn: "1d",
  });
  return token;
};

// create models
const User = mongoose.model("User", userSchema);

// export models
module.exports = User;

//? OR directally export in one line
// module.exports = mongoose.model("User", userSchema);
