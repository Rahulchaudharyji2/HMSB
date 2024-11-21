const express= require('express');
const router=express.Router();
const FamilyDetails=require('../models/FamilyModel');
const jwt = require ('jsonwebtoken')
// secret key
const jwtSecretKey = "ifOO3gIusVyChhors3r3dAAlmCZR2xqc";


//adding family details
router.post('/addFamilyDetails', async (req, res) => {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).send('Unauthorized');
    }
  
    const user = jwt.verify(token, process.env.SECRET_KEY);
    const { countryCode, mobileNumber } = user;
  
    // Get the family details from the request body
    const { familyDetails } = req.body;
  
    try {
      // Update the user's profile with the family details
      const updatedUser = await updateUserProfile(countryCode, mobileNumber, familyDetails);
      res.status(200).json({ message: 'Family details added successfully' });
    } catch (error) {
      res.status(500).send(`Error adding family details: ${error.message}`);
    }
  });
  module.exports=router;
