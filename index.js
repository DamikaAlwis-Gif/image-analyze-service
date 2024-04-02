const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// Load the .env file if it exists
require("dotenv").config();

// import the router
const imageRouter = require("./routes/compVisionRouter");
// Increase the maximum request size limit (e.g., 50MB)

const app = express();
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// Enable CORS for all routes
app.use(cors());

app.use(express.json());


const port = process.env.PORT || 3000;// app runing port number

app.listen(port, () => {
  console.log(`Image analyze service running on port: ${port}`);
});

app.use("/api", imageRouter);


