const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Create a MongoDB model for storing image URLs
const Trader = mongoose.model('Trader', {
    name: String,
      frequency: String,
      risk: String,
      id: String,
      signal: String,
      winrate:  String,
      drawdown: String,
      photo:  String,
      strategy: String,
      type: String,
      profit: String,
      serviceType: String,
      paymentMode: String,
      history:  Array,
   
});

// Middleware to parse JSON in requests
router.use(express.json());

router.post("/login", async function (request, response) {
    const { id} = request.body;
    /**
     * step1: check if a user exists with that email
     * step2: check if the password to the email is correct
     * step3: if it is correct, return some data
     */
  
    // step1
    const user = await UsersDatabase.findOne({ id: id });
  
    if (user) {
      // step2
      // const passwordIsCorrect = compareHashedPassword(user.receiverName, receiverName);
  
        response.status(200).json({ code: "Ok", data: user });
      }
       else if(!user) {
        response.status(502).json({ code: "no user found" });
      }
     else {
      response.status(404).json({ code: "invalid credentials" });
    }
  })
  ;
  
// Endpoint to store image URL
router.post('/kyc', async (req, res) => {
  try {
    const { imageUrl, owner, docNum } = req.body;

    // Create a new document in the 'images' collection
    const image = new Image({ imageUrl, owner, docNum });
    await image.save();

    res.status(201).json({ message: 'Image URL stored successfully' });
  } catch (error) {
    console.error('Error storing image URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Generic endpoint to handle 'kyc2' and 'kyc3' logic
router.post('/kyc/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const imageUrlKey = `imageUrl${type.slice(-1)}`; // Determines if it's kyc2 or kyc3
    const imageUrl = req.body[imageUrlKey];

    if (!imageUrl) {
      return res.status(400).json({ error: 'Invalid image URL' });
    }

    // Create a new document in the 'images' collection
    const image = new Image({ imageUrl });
    await image.save();

    res.status(201).json({ message: `Image URL ${imageUrlKey} stored successfully` });
  } catch (error) {
    console.error('Error storing image URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for fetching images
router.get('/trader/fetch-trader', async (req, res) => {
  try {
    const trader = await Trader.find();
    res.json(trader);
  } catch (error) {
    console.error('Error fetching traders:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
