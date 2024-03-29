const express = require("express");
const router = express.Router();

const { ImageAnalysisClient } = require("@azure-rest/ai-vision-image-analysis");
const createClient = require("@azure-rest/ai-vision-image-analysis").default;
const { AzureKeyCredential } = require("@azure/core-auth");


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


router.post("/imageanalysis/url",async (req,res) => {

  try {
    const imageUrl = req.body.imageUrl;
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

    res.status(200).json({ result: iaResult });

    
  } catch (error) {
    res.status(500).json({error})
  }
  

})


module.exports = router;





// const imageUrl =
//   "https://th.bing.com/th/id/OIP.XztsnQoaNQ-XS4t4VFlbDAHaD3?rs=1&pid=ImgDetMain";

// async function analyzeImageFromUrl() {
  
//   console.log(iaResult);

//   // if (iaResult.captionResult) {
//   //   console.log(
//   //     `Caption: ${iaResult.captionResult.text} (confidence: ${iaResult.captionResult.confidence})`
//   //   );
//   // }
//   // // if (iaResult.readResult) {
//   // //   iaResult.readResult.blocks.forEach((block) =>
//   // //     console.log(`Text Block: ${JSON.stringify(block)}`)
//   // //   );
//   // // }

//   // if (iaResult.objectsResult) {
//   //   iaResult.objectsResult.values.forEach((object) =>
//   //     console.log(`Object: ${JSON.stringify(object)}`)
//   //   );
//   // }
//   // if (iaResult.tagsResult) {
//   //   iaResult.tagsResult.values.forEach((tag) =>
//   //     console.log(`Tag: ${JSON.stringify(tag)}`)
//   //   );
//   // }
// }

// analyzeImageFromUrl();