const Tag = require("../models/tag.model");

module.exports.createNewTag = async (req, res) => {
  try {
    if (!req.body.name)
      return res.status(400).json({ error: "Please give a Tag name." });
    const tag = new Tag(req.body);
    const tagResponse = await tag.save();
    if (!tagResponse)
      return res.status(400).json({
        error: "Some error occured while saving Tag. Please try again.",
      });
    return res.status(200).json({ message: "Tag saved successfully." });
  } catch (error) {
    if (error.code == 11000)
      return res.status(400).json({
        error:
          "Tag with entered Name already Exists. Please try again with different Tag Name.",
      });
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};

module.exports.fetchAllTags = async (req, res) => {
  try {
    const tagResponse = await Tag.find();
    if(!tagResponse)
        return res.status(400).json({ error: "No Tag exists. Please insert some tags first." })
    return res.status(200).json({ tagResponse });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Some error occurred with the request itself. Please check logs and try again.",
    });
  }
};
