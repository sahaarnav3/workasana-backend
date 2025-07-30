const jwt = require('jsonwebtoken');

//A middleware to check if there is a token. If there is then redirect user to home page, or redirect user to login page.(to generate a new token).
const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided. Get a token first." });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(403)
      .json({ error: "Invalid or Expired Token. Create another token." });
  }
};

module.exports = verifyJWT;