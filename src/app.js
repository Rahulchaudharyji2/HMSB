require('dotenv').config(); // Load environment variables
// app.js
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Create Express app
const app = express();


// Import routes;
const hospitalRegistrationRoutes = require('./Routes/hospitalRegistrationRoutes');
const adminRoutes = require('./Routes/adminRoutes');
const familyDetails = require('./Routes/addFamilyRoutes');
const OTP = require('./models/otp');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'https://dapper-kashata-8a950f.netlify.app', // Update this with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));
app.use(cookieParser());



// In app.js
const otp = new OTP(
  process.env.OTP_BASE_URL,
  process.env.OTP_API_KEY,
  process.env.OTP_EMAIL,
  process.env.OTP_PASSWORD
);


// Routes
app.use('/hospital', hospitalRegistrationRoutes);
app.use('/admin', adminRoutes);
app.use('/family', familyDetails);


// Route to send OTP
app.post('/sendotp/:countryCode/:mobileNumber', async (req, res) => {
  const { countryCode, mobileNumber } = req.params;
  try {
    const authToken = await otp.generateAuthToken();
    const response = await otp.sendOtp(authToken, countryCode, mobileNumber);

    // Log the full response object for debugging
    console.log('OTP Send Response:', response);

    // Check if response.data exists and has the necessary fields
    if (response.data && response.data.responseCode === 200 && !response.data.errorMessage) {
      res.status(200).send('OTP sent successfully!');
    } else {
      // Provide more information about the error
      const errorMessage = response.data?.errorMessage || 'Unknown error';
      res.status(400).send(`Bad Request: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ errMsg: 'Internal Server Error' });
  }
});


// Route to validate OTP
app.post('/validateOtp/:countryCode/:mobileNumber/:otpCode', async (req, res) => {
  const { countryCode, mobileNumber, otpCode } = req.params;
  try {
    const authToken = await otp.generateAuthToken();
    const response = await otp.validateOtp(authToken, otpCode, countryCode, mobileNumber);

    // Log the full response for debugging
    console.log('OTP Validate Response:', response);

    if (response.data && response.data.verificationStatus === 'VERIFICATION_COMPLETED') {
      const user = { countryCode, mobileNumber };
      const token = jwt.sign(user, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 3600000), // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set to true in production
      });

      res.status(200).json({ token });
    } else {
      res.status(400).send(`Bad Request: ${response.data ? response.data.errorMessage : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error validating OTP:', error);
    res.status(500).json({ errMsg: 'Internal Server Error' });
  }
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const { status = 500, message = 'Internal Server Error' } = err;
  res.status(status).json({ errMsg: message });
  next();
});

// Server listening
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
