const express = require("express");
const router = express.Router();

const projectController = require("../controller/projectController");
const verifyJWT = require("../middlewares/verifyJWT");

// console.log("Project Router Loaded.");

//Route to create new Project
router.post("/", verifyJWT, projectController.createNewProject);

//Route to fetch all existing projects
router.get("/", verifyJWT, projectController.fetchProjects);

module.exports = router;
