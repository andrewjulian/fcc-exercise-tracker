const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

mongoose.connect(
  "mongodb+srv://user1:user1@exercise-tracker.g7csotb.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const Schema = mongoose.Schema;

const userObj = new Schema({
  username: { type: String, required: true },
  _id: { type: String, required: true },
});

const user = mongoose.model("user", userObj);
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/users", async (req, res) => {
  const { username } = req.body;
  const _id = uuidv4();

  const newUser = new user({ username, _id });
  try {
    const data = await newUser.save();
    return res.json({
      username: data.username,
      _id: data._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Could not create user." });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const data = await user.find();
    return res.json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Could not get users." });
  }
});

const exerciseObj = new Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const exercise = mongoose.model("exercise", exerciseObj);

app.post("/api/users/:_id/exercises", async (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const currentUser = user.findById(_id);

  const newExercise = new exercise({
    userId: _id,
    description,
    duration,
    date: date ? new Date(date) : new Date(),
  });

  try {
    const data = await newExercise.save();
    const user = await currentUser.exec();
    return res.json({
      username: user.username,
      description: data.description,
      duration: data.duration,
      date: new Date(data.date)
        .toLocaleString("en-US", {
          timeZone: "GMT",
          weekday: "short",
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
        .replace(/,/g, ""),
      _id: data.userId,
    });
  } catch (err) {
    console.log(err);
  }
});
