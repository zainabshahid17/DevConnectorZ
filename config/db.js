//Configuring Database using Mongoose
const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI"); //pulls from default.json

const connectDB = async()=> {
    try{
           await  mongoose.connect(db);
           console.log("MongoDB Connected");

    }catch(err){
        console.error(err.message);
        //Exit process with failure
        process.exit(1);
    }
}
module.exports = connectDB;