const express = require('express');
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const teamController = require("../controller/teamController");

// console.log("Team Router Loaded.");

//Route to create a new Team.
router.post("/", verifyJWT, teamController.createNewTeam);

//Route to fetch all Teams.
router.get("/", verifyJWT, teamController.fetchAllTeams);

module.exports = router;