const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const { initialiseDatabase } = require("./db/db.connect");

//Importing Routes
const userRoutes = require("./routes/userRoutes");
const projectRoutes = require("./routes/projectRoutes");
const teamRoutes = require("./routes/teamRoutes");
const tagRoutes = require("./routes/tagRoutes");
const taskRoutes = require("./routes/taskRoutes");

const corsOption = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOption));
app.use(express.json());
initialiseDatabase();

app.get("/", (req, res) => {
  res.send("<h1>Hi, Welcome to homepage of this Backend App.</h1>");
});

//Authorization/User API
app.use("/auth", userRoutes);
//Project API
app.use("/projects", projectRoutes);
//Team API
app.use("/teams", teamRoutes);
//Tags API
app.use("/tags", tagRoutes);
//Task API
app.use("/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
