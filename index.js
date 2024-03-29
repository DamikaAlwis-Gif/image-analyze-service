const express = require("express");
const bodyParser = require("body-parser");

// Load the .env file if it exists
require("dotenv").config();

// import the router
const imageRouter = require("./routes/compVisionRouter");

const app = express();


app.use(express.json());


const port = process.env.PORT || 3000;// app runing port number

app.listen(port, () => {
  console.log(`Image analyze service running on port: ${port}`);
});

app.use("/api", imageRouter);


