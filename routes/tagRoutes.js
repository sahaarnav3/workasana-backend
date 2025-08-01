const express = require('express');
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const tagController = require('../controller/tagController');

// console.log("Tag Router Loaded.");

//Route to create a new TAG.
router.post("/", verifyJWT, tagController.createNewTag);

//Route to fetch all tags
router.get("/", verifyJWT, tagController.fetchAllTags);

module.exports = router;