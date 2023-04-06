const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const MONGO_URI = process.env.MONGO_URI;
const bodyParser = require("body-parser");

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;

const userObj = new Schema({
  username: { type: String, required: true },
  _id: { type: String, required: true },
});

const user = mongoose.model("user", userObj);
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/api/users", (req, res) => {
  const username = req.username;
  const _id = uuidv4();
  try {
    const newUser = new user({ username, _id });
    newUser.save((err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/users", (req, res) => {
  user.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

const exerciseObj = new Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true },
});

const exercise = mongoose.model("exercise", exerciseObj);

app.get("/api/users", (req, res) => {
  user.find({}, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});
