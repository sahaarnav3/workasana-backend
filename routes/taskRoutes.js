const express = require('express');
const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const taskController = require("../controller/taskController");

// console.log("Task Router Loaded.")

//Route to create new task
router.post("/", verifyJWT, taskController.createNewTask);

//Route to fetch tasks with or without filters
router.get("/", verifyJWT, taskController.fetchTasks);

//Route to update tasks with id
router.post("/:id", verifyJWT, taskController.updateTask);

//Route to delete task with id.
router.delete("/:id", verifyJWT, taskController.deleteTask);

module.exports = router;