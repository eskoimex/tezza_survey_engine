const dotenv = require("dotenv")
dotenv.config()

const db = require("../models");

const connectDB = async ()=>{
    try{

            //  db.mongoose.connect(`mongodb://${process.env.HOST_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,{
                db.mongoose.connect(process.env.DB_STRING,{
                    useUnifiedTopology: true,
                    useNewUrlParser: true
                 }).then(() => {
                console.log("Successfully Connected to MongoDB.");
                })
                .catch(err => {
                    console.error("Connection error", err);
                    process.exit();
                });
    } catch(error){
      console.log(error)
    }
}

module.exports = connectDB
