const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { initialiseDatabase } = require("./db/db.connect");

const Project = require("./models/project.model");
const Tag = require("./models/tag.model");
const Task = require("./models/task.model");
const Team = require("./models/team.model");
const User = require("./models/user.model");

const corsOption = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());
initialiseDatabase();

//Function to convert text password into hash and return it
async function passwordHashAndSave(password) {
  const saltRounds = 10; //More salt rounds equal more computation power/time.
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

//A middleware to check if there is a token. If there is then redirect user to home page, or redirect user to login page.(to generate a new token).
const verifyJWT = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token)
    return res
      .status(401)
      .json({ message: "No token provided. Get a token first." });

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log(error);
    return res
      .status(402)
      .json({ error: "Invalid or Expired Token. Create another token." });
  }
};

app.get("/", (req, res) => {
  res.send("<h1>Hi, Welcome to homepage of this Backend App.</h1>");
});

//------------------------- USER Routes -------------------------//

//First thing is nothing should happen if the user is not loggedin.
//Route to sign-up (create) the user.
app.post("/auth/signup", async (req, res) => {
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
});

//Route to log-in a user
app.post("/auth/login", async (req, res) => {
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
});

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
