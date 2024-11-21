const express = require('express');
const router = express.Router();
const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { BadRequestError, AuthenticationError } = require('../core/ApiError');
const catchAsync = require('../core/catchAsync');
const Hospital = require('../models/hospitalpasswordModel');
const { isLoggedIn } = require('../middleware/authMiddleware');

// Secret key for JWT
const jwtSecretKey = process.env.JWT_SECRET_KEY || "your_default_secret_key"; // Prefer using env variables

// Create Admin (This route might be used only for initial setup, not for regular use)
router.post('/create-admin', catchAsync(async (req, res) => {
    const plainPassword = '12345';
    const hash = await bcrypt.hash(plainPassword, 12);
    const admin = await Admin.create({ adminname: 'admin', password: hash, email: 'admin@gmail.com' });
    res.status(201).json(admin);
}));

// Admin Login
router.post('/login', catchAsync(async (req, res) => {
    const { adminname, password } = req.body;
    
    const admin = await Admin.findOne({ adminname });
    if (!admin) {
        throw new AuthenticationError("Admin with this adminname doesn't exist");
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
        throw new AuthenticationError('Invalid adminname or password');
    }

    const token = jwt.sign({ adminId: admin._id }, jwtSecretKey, { expiresIn: '7d' });

    res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ message: "Logged In Successfully." });
}));

// Admin Logout
router.post('/logout', isLoggedIn, (req, res) => {
    res.cookie('token', "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logged out successfully" });
});

// Create Hospital
router.post('/admin/hospital', catchAsync(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Please Provide Correct Details');
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const hospital = await Hospital.create({ email, password: hashedPassword });
    res.status(201).json(hospital);
}));

module.exports = router;
