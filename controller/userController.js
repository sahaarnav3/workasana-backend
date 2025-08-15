const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require('jsonwebtoken');

//Function to convert text password into hash and return it
async function passwordHashAndSave(password) {
  const saltRounds = 10; //More salt rounds equal more computation power/time.
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

//First thing is nothing should happen if the user is not loggedin.
//Controller to sign-up (create) the user.
module.exports.signUpUser = async (req, res) => {
  try {
    if (!(req.body.email && req.body.password && req.body.name))
      return res
        .status(400)
        .json({ error: "Please enter a proper name, email and password." });
    const email = req.body.email;
    if (
      !(
        email.includes("@") &&
        email.includes(".com") &&
        email.indexOf("@") < email.indexOf(".com")
      )
    )
      return res
        .status(400)
        .json({ error: "Please follow proper email format and try again." });

    req.body.password = await passwordHashAndSave(req.body.password);
    // console.log(req.body);
    // return res.status(200).json(req.body);
    const user = new User(req.body);
    const userResponse = await user.save();
    if (!userResponse)
      return res.status(400).json({
        error:
          "Some error occurred. The request couldn't be saved. Please try again.",
      });
    return res.status(200).json({ message: "User created successfully." });
  } catch (error) {
    console.log(error);
    if (error.code == 11000)
      return res.status(400).json({
        error:
          "The given email ID already exists. Please try with different email.",
      });
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};

//Controller to Log-In a user.
module.exports.login = async (req, res) => {
  try {
    if (!(req.body.email && req.body.password))
      return res
        .status(400)
        .json({ error: "Please enter a proper email and password." });

    const userResponse = await User.find({ email: req.body.email });
    if (userResponse.length <= 0)
      return res.status(404).json({
        error:
          "User with given email-ID is not present. Please try again with another email.",
      });
    // console.log(userResponse);
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userResponse[0].password
    );
    if (!passwordMatch)
      return res.status(401).json({
        error:
          "Entered Password is Incorrect. Please try again with correct password.",
      });
    const token = jwt.sign(
      {
        _id: userResponse[0]._id,
        name: userResponse[0].name,
        email: userResponse[0].email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7 days" }
    );
    return res.status(200).json({ userToken: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};

//Controller to fetch current logged in user details, based on token.
module.exports.currentUser = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};

//Controller to fetch all the users present.
module.exports.fetchAllUsers = async (req, res) => {
  try {
    const userResponse = await User.find().select('_id name').exec();
    if(!userResponse)
      return res.status(400).json({ error: "Either no users present or some other error occurred. Please try again."});
    return res.status(200).json(userResponse);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
}