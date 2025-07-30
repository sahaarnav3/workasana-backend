const Project = require("../models/project.model");

//Controller to create new project
module.exports.createNewProject = async (req, res) => {
  try {
    if (!(req.body.name.length > 0 && req.body.description.length > 0))
      return res
        .status(400)
        .json({ error: "Please enter a proper name and description." });

    const project = new Project(req.body);
    const projectResponse = await project.save();
    if (!projectResponse)
      return res.status(400).json({
        error:
          "Some error occurred. The request couldn't be saved. Please try again.",
      });
    return res.status(200).json({ message: "Project Added Successfully." });
  } catch (error) {
    if (error.code == 11000)
      return res.status(400).json({
        error:
          "Project with entered Name already Exists. Please try again with different Project Name.",
      });
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};

//Controller to fetch all projects
module.exports.fetchProjects = async (req, res) => {
  try {
    const projectResponse = await Project.find();
    if (!projectResponse)
      return res
        .status(400)
        .json({
          error: "No Projects Present. Please enter some projects first.",
        });
    return res.status(200).json(projectResponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};
