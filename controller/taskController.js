const Task = require("../models/task.model");

//Controller to create new task.
module.exports.createNewTask = async (req, res) => {
  try {
    const taskBody = req.body;
    if (
      !(
        taskBody &&
        taskBody.name &&
        taskBody.project &&
        taskBody.team &&
        taskBody.owners.length > 0 &&
        taskBody.timeToComplete &&
        taskBody.status
      )
    )
      return res.status(400).json({
        error:
          "Please enter values in all the fields. No field other than status can be kept empty.",
      });
    const task = new Task(taskBody);
    const taskResponse = await task.save();
    if (!taskResponse)
      return res
        .status(400)
        .json({ error: "Task details couldn't be saved. Please try again." });
    return res.status(200).json({ message: "Task saved successfully.", data: taskResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};

//Controller to fetch tasks (with or without filters.)
module.exports.fetchTasks = async (req, res) => {
  try {
    const searchQuery = {};
    if (req.query.project) searchQuery.project = req.query.project;
    if (req.query.team) searchQuery.team = req.query.team;
    if (req.query.owner && req.query.owner.split(" ").length > 0)
      searchQuery.owners = req.query.owner.split(" ");
    if (req.query.tags && req.query.tags.split(" ").length > 0)
      searchQuery.tags = req.query.tags.split(" ");
    if (req.query.timeToComplete)
      searchQuery.timeToComplete = req.query.timeToComplete;
    if (req.query.status) searchQuery.status = req.query.status;
    // console.log(searchQuery);
    const taskResponse = await Task.find(searchQuery)
      .populate(["project", "team", "owners"])
      .exec();
    if (!taskResponse || taskResponse.length < 1)
      return res.status(400).json({
        error: "No task with given filter value(s) found. Please try again.",
      });
    return res.status(200).json(taskResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};

//Controller to update a task.
module.exports.updateTask = async (req, res) => {
  try {
    const taskResponse = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate(["project", "team", "owners"])
      .exec();
    if (!taskResponse)
      return res
        .status(404)
        .json({
          error:
            "Task with given ID not found. Please try again with correct ID.",
        });
    return res.status(200).json(taskResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};

//Controller to delete a task.
module.exports.deleteTask = async (req, res) => {
  try {
    const taskResponse = await Task.findByIdAndDelete(req.params.id);
    if(!taskResponse)
      return res.status(404).json({ error: "Task with given ID doesn't exist. Try again with correct ID."})
    return res.status(200).json({ message: "Task deleted successfully."});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};
