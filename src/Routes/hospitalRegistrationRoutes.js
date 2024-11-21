const express = require('express');
const router = express.Router();
const Hospital = require('../models/hospitalRegistrationModel');
const HospitalPassword = require('../models/hospitalpasswordModel');
const catchAsync = require('../core/catchAsync');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { BadRequestError, AuthenticationError, NotFoundError } = require('../core/ApiError');

// JWT Secret Key
const jwtSecretKey = process.env.JWT_SECRET_KEY;

// Get all hospitals
router.get('/hospitals', catchAsync(async (req, res) => {
  const hospitals = await Hospital.find();
  res.json(hospitals);
}));

// Register a new hospital
router.post('/hospitals', [
  // Validation using express-validator
  body('hospitalname').notEmpty().withMessage('Hospital name is required'),
  body('nodalEmail').isEmail().withMessage('Valid email is required'),
  // Add more validation as needed
], catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    hospitalname,
    hospitalType,
    government,
    hospitalAddress,
    hospitalState,
    hospitalDistrict,
    hospitalWebsite,
    hospitalAvgOPD,
    hospitalDoctors,
    nodalOfficerName,
    nodalDesignation,
    nodalMobileNumber,
    nodalLandLineNumber,
    nodalEmail,
    nameofHospitalAdd,
    freeBeds,
  } = req.body;

  // Check if the hospital already exists
  const hospitalExist = await Hospital.findOne({ hospitalname });
  if (hospitalExist) {
    throw new BadRequestError('Hospital already exists');
  }

  // Create new hospital
  const hospital = await Hospital.create({
    hospitalname,
    hospitalType,
    government,
    hospitalAddress,
    hospitalState,
    hospitalDistrict,
    hospitalWebsite,
    hospitalAvgOPD,
    hospitalDoctors,
    nodalOfficerName,
    nodalDesignation,
    nodalMobileNumber,
    nodalLandLineNumber,
    nodalEmail,
    nameofHospitalAdd,
    freeBeds,
  });

  res.status(201).json({ message: 'Hospital created successfully', hospital });
}));

// Hospital Login
router.post('/hospital/login', catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const hospital = await HospitalPassword.findOne({ email });
  if (!hospital) {
    throw new AuthenticationError('Invalid email or password');
  }

  const isValidPassword = await bcrypt.compare(password, hospital.password);
  if (!isValidPassword) {
    throw new AuthenticationError('Invalid email or password');
  }

  const token = jwt.sign({ hospitalName: hospital.hospitalname }, jwtSecretKey, {
    expiresIn: '1h',
  });

  // Set the cookie
  res.cookie('jwt', token, {
    expires: new Date(Date.now() + 3600000), // 1 hour
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
  });

  res.status(200).json({ message: 'Hospital logged in successfully' });
}));

// Update Hospital Details
const allowedUpdates = ['hospitalAddress', 'nodalMobileNumber', 'nodalLandLineNumber', 'freeBeds', 'hospitalname', 'hospitalType', 'government', 'hospitalState', 'hospitalDistrict', 'hospitalWebsite', 'hospitalAvgOPD', 'hospitalDoctors', 'nodalOfficerName', 'nodalDesignation', 'nodalEmail', 'nameofHospitalAdd'];

router.patch('/hospital/:name', catchAsync(async (req, res) => {
  const hospitalName = req.params.name;
  const updates = {};

  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const hospital = await Hospital.findOneAndUpdate({ hospitalname: hospitalName }, updates, { new: true });
  if (!hospital) {
    throw new NotFoundError('Hospital not found');
  }

  res.status(200).json(hospital);
}));

module.exports = router;
