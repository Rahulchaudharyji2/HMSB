
const jwt = require('jsonwebtoken');
const{AuthenticationError}= require('../core/ApiError')
const jwtSecretKey = "ifOO3gIusVyChhors3r3dAAlmCZR2xqc";

const authenticate = async (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) {
        return res.status(401).send({ error: 'Please authenticate' });
    }

    const token = authorizationHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send({ error: 'Please authenticate' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        req.hospitalName = decoded.hospitalName;
        next();
    } catch (err) {
        return res.status(401).send({ error: 'Invalid token' });
    }
};

module.exports = { authenticate };