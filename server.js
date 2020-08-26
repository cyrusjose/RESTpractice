require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const db = mongoose.connection;

db.on("error", error => {
  console.error(error);
});
db.once("open", () => {
  console.log("connected to database");
});

//This allows our server accept json as a body instead of a post or get element.
app.use(express.json());

// route set up

const subscribersRouter = require("./routes/subscribers");
app.use("/subscribers", subscribersRouter);

app.listen(3000, () => {
  console.log("server has started");
});
