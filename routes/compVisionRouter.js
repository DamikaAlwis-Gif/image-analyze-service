const express = require("express");
const router = express.Router();
const fs = require("fs");

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

// iamge analysis using image url
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

    if(iaResult.error) {
      const error = iaResult.error;
      res.status(400).json({error});
    }
    else{
      res.status(200).json({ result: iaResult });
    }

    
  } catch (error) {
    res.status(500).json({error})
  }
  
});

// handeling local images
router.get("/imageanalysis/image", async (req, res) => {
  try {

    const imagePath = "./images/image_2.jpeg";
    const imageBuffer = fs.readFileSync(imagePath);
    //console.log(imageBuffer);
    const result = await client.path("/imageanalysis:analyze").post({
      body: imageBuffer,
      queryParameters: {
        features: features,
      },
      contentType: "application/octet-stream",
    });

    const iaResult = result.body;

    if (iaResult.error) {
      const error = iaResult.error;
      res.status(400).json({ error });
    } else {
      res.status(200).json({ result: iaResult });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});


// router.post("/imageanalysis/image", async (req, res) => {
//   const formData = req.body;
//   console.log(formData);

//   res.json("success");
// });






module.exports = router;
