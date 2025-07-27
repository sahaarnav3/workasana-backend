const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

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

// const verifyJWT = (req, res, next) => {

// }

app.get("/", (req, res) => {
  res.send("<h1>Hi, Welcome to homepage of this Backend App.</h1>");
});

//First thing is nothing should happen if the user is not loggedin.
//Route to sign-up (create) the user.
app.post("/auth/signup", async (req, res) => {
  try {
    if(!(req.body.email && req.body.password && req.body.name))
        return res.status(400).json({ error: "Please enter a proper name, email and password."});
    const email = req.body.email;
    if(!(email.includes('@') && email.includes('.com') && (email.indexOf('@') < email.indexOf('.com'))))
        return res.status(400).json({ error: "Please follow proper email format and try again."});

    req.body.password = await passwordHashAndSave(req.body.password);
    // console.log(req.body);
    // return res.status(200).json(req.body);
    const user = new User(req.body);
    const userResponse = await user.save();
    if(!userResponse)
        return res.status(400).json({error: "Some error occurred. The request couldn't be saved. Please try again."});
    return res.status(200).json({ message: "User created successfully." });
  } catch (error) {
    console.log(error);
    if(error.code == 11000)
        return res.status(400).json({ error: "The given email ID already exists. Please try with different email."});
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
