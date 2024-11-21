const { BadRequestError } = require('../core/ApiError');
const jwt = require('jsonwebtoken')

const jwtSecretKey = process.env.JWT_SECRET || "ifOO3gIusVyChhors3r3dAAlmCZR2xqc";

const isLoggedIn = async(req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        throw new BadRequestError('Please login to continue');
    }
    try {
        // below methow will throw an exception in case token is invalid.
        const { userId } = jwt.verify(token, jwtSecretKey); 

        // Adding userId in the request object
        req.userId = userId;
        return next()
    }
    catch (err) {
        throw new BadRequestError('Inavlid Auth Token')
    }
}
module.exports = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({
          message: "Auth Fialed",
          success: false,
        });
      } else {
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({
      message: "Auth Failed",
      success: false,
    });
  }
};

module.exports= {
    isLoggedIn
}