const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");

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

const upload = multer({ dest: "uploads/" });

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
      res.status(200).json({ result: iaResult.captionResult });
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
      res.status(200).json({ result: iaResult.captionResult });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

// handeling image uploads
router.post("/imageanalysis/image",upload.single("image"), async (req, res) => {
 
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
   
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
      // Convert JSON object to a string
      const jsonString = JSON.stringify(iaResult);

      // Output the string representation
      console.log(jsonString + "\n");
      
      res.status(200).json({ result: iaResult });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});


// handeling image buffers
router.post("/imageanalysis/imagebuffer", async (req, res) => {
 
  try {

    const imageBuffer = req.body.imageBuffer

    const bufferObject = Buffer.from(imageBuffer.data);
    console.log(bufferObject)

    const result = await client.path("/imageanalysis:analyze").post({
      body: bufferObject,
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
      res.status(200).json({ result: iaResult.captionResult });
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});







module.exports = router;
