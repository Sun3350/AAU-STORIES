// routes/userRoutes.js
const express = require('express');
const User = require('../model/User');
const cloudinary = require('../config/cloudconfig');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const router = express.Router();
const multer = require('multer');
const Confession = require('../model/Comfession')
// Set up storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Blog Image',
      format: async (req, file) => 'jpg', // supports promises as well
      public_id: (req, file) => Date.now().toString(),
    },
  });
  


// Initialize multer
const upload = multer({ storage: storage });

router.post('/search', async (req, res) => {
    const { gender, location } = req.body;
  
    if (!gender || !location) {
      return res.status(400).json({ message: 'Gender and location are required' });
    }

    try {
      const users = await User.find({
        gender: { $regex: new RegExp(`^${gender}$`, 'i') },  // Case-insensitive match
        location: { $regex: new RegExp(`^${location}$`, 'i') }  // Case-insensitive match
      });
  
      if (users.length > 0) {
        res.json(users);
        
      } else {
        res.status(404).json({ message: 'No users found' });
      }
    } catch (err) {
      console.error('Error searching for users:', err);
      res.status(500).json({ message: 'Server error' });
    }
   
  });
  
  


// Example of creating a new user
router.post('/users', upload.single('image'), async (req, res) => {
    const { name, location, gender, desc, contact,facebookLink, whatsappNumber, instagramLink } = req.body;
    const imageUrl = req.file.path;
    try {
      const newUser = new User({
        name,
        location,
        gender,
        desc,
        contact,
        image: imageUrl,
        facebookLink,
        whatsappNumber,
        instagramLink
      });
  
      await newUser.save();
      res.status(201).json(newUser);
      console.log('user created')
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

  router.post('/submit-comfession', async (req, res) => {
    try {
      const { text } = req.body;
      const newConfession = new Confession({ text });
      await newConfession.save();
      res.status(201).json(newConfession);
    } catch (error) {
      res.status(400).json({ message: 'Error submitting confession' });
    }
  });
  
  // Get all confessions
  router.get('/get-all-confessions', async (req, res) => {
    try {
      const confessions = await Confession.find();
      res.json(confessions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching confessions' });
    }
  });
  
  router.get('/confession/:confessionId', async (req, res) => {
    try {
        const confessionId = req.params.confessionId ; 
        const confession = await Confession.findById({ _id: confessionId });
        if (!confession) {
            return res.status(404).json({ message: 'Confession not found' });
        }
        res.status(200).json(confession);
    } catch (error) {
        console.error('Error fetching confession:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

  // Add a comment to a confession
  router.post('/confessions/:id/confession-comment', async (req, res) => {
    try {
        const { tex } = req.body;
        const confession = await Confession.findById(req.params.id);
        if (!confession) {
            return res.status(404).json({ message: 'Confession not found' });
        }
        confession.comments.push({ tex });
        await confession.save();
        res.status(201).json(confession);
    } catch (error) {
        res.status(400).json({ message: 'Error adding comment' });
    }
});

  
module.exports = router;
