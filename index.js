const { ImageAnalysisClient } = require("@azure-rest/ai-vision-image-analysis");
const createClient = require("@azure-rest/ai-vision-image-analysis").default;
const { AzureKeyCredential } = require("@azure/core-auth");

// Load the .env file if it exists
require("dotenv").config();

// import the router
const imageRouter = require("./routes/imageRouter");



const express = require('express'); 

const app = express();
app.use(express.json());

app.listen(process.env.PORT , () => {console.log("Connected to the image analyze service.")})



const endpoint = process.env.VISION_ENDPOINT;
const key = process.env.VISION_KEY;

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const features = [
  "Caption",
  "DenseCaptions",
  "Objects",
  "People",
  "Read",
  "SmartCrops",
  "Tags",
];

const imageUrl =
  "https://www.bhphotovideo.com/images/images2000x2000/Apple_Z0GF_0003_27_iMac_Desktop_Computer_657777.jpg";

async function analyzeImageFromUrl() {
  const result = await client.path("/imageanalysis:analyze").post({
    body: {
      url: imageUrl,
    },
    queryParameters: {
      features: features,
    },
    contentType: "application/json",
  });

  const iaResult = result.body;

  if (iaResult.captionResult) {
    console.log(
      `Caption: ${iaResult.captionResult.text} (confidence: ${iaResult.captionResult.confidence})`
    );
  }
  // if (iaResult.readResult) {
  //   iaResult.readResult.blocks.forEach((block) =>
  //     console.log(`Text Block: ${JSON.stringify(block)}`)
  //   );
  // }
  if (iaResult.objectsResult) {
    iaResult.objectsResult.values.forEach((object) =>
      console.log(`Object: ${JSON.stringify(object)}`)
    );
  }
  if (iaResult.tagsResult) {
    iaResult.tagsResult.values.forEach((tag) =>
      console.log(`Tag: ${JSON.stringify(tag)}`)
    );
  }

}

analyzeImageFromUrl();

app.use("image", imageRouter);
