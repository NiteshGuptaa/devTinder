const mongoose = require("mongoose");

// connect to DB
// mongoose.connect(
//   "mongodb+srv://Nitesh:twvqya7DFg2GN0od@cluster0.by3xf.mongodb.net/"
// );


// Good way to connect to DB  (it'll return promise)
const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Nitesh:twvqya7DFg2GN0od@cluster0.by3xf.mongodb.net/devTinder"
  );
};

module.exports = connectDB;


// connectDB().then(()=>{
//     console.log("Database connection established...");
// }).catch(err => {
//    console.error("Database cannot be connected!!")
// })