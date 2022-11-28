const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv")

dotenv.config()
const app = express();


const cookieParser = require('cookie-parser');
app.use(cookieParser());

//set up cors
let corsOptions = {
  origin: true
};
app.use(cors(corsOptions));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// connect to database 
const connectDB = require('./app/utils/db.util')
connectDB()

// server route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Tezza Survey Engine back-end service. GOOD TO GO!" });
});


// routes
require('./app/routes/auth.routes')(app);
// require('./app/routes/authorization.routes')(app);
// require('./app/routes/user.routes')(app);
// require('./app/routes/recommendation.routes')(app);
// require('./app/routes/category.routes')(app);
// require('./app/routes/subCategory.routes')(app);
// require('./app/routes/content.routes')(app);


app.listen(process.env.PORT, () => {
   console.log(`${process.env.NAME} is listening on port ` + process.env.PORT)
});

