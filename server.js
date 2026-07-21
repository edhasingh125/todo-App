const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const User = require("./models/User");
const Task = require("./models/Task");

const app = express();

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "public")));


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});


app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const userExists = await User.findOne({ username });

    if (userExists) {
      return res.json({ message: "User already exists" });
    }

    const user = new User({
      username,
      password,
    });

    await user.save();

    res.json({
      message: "Registration Successful",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      username,
      password,
    });

    if (!user) {
      return res.json({
        message: "Invalid Username or Password",
      });
    }

    res.json({
      message: "Login Successful",
      userId: user._id,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.post("/tasks", async (req, res) => {
  try {
    const { title, userId } = req.body;

    const task = new Task({
      title,
      userId,
    });

    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.get("/tasks/:userId", async (req, res) => {
  try {
    const tasks = await Task.find({
      userId: req.params.userId,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task Deleted",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});