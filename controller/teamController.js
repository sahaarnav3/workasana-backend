const Team = require("../models/team.model");

module.exports.createNewTeam = async (req, res) => {
  try {
    if(!(req.body.name.length > 0 && req.body.members.join(" ").length > 0))
      return req.status(400).json({ error: "Please enter proper Team Name & Team members first name separated by space." });
    const team = new Team(req.body);
    const teamResponse = await team.save();
    if(!teamResponse)
      return req.status(400).json({ error : "Some error occurred. The request couldn't be saved. Please try again." });
    return res.status(200).json({ message: "Team added successfully." });
  } catch (error) {
    if (error.code == 11000)
      return res.status(400).json({
        error:
          "Team with entered Name already Exists. Please try again with different Team Name.",
      });
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};
