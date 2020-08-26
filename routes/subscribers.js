const express = require("express");
const router = express.Router();
const Subscriber = require("../models/subscriber");

// Getting all subs
router.get("/", async (req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  } catch (err) {
    //   500 means that the database had some error and it's our fault
    res.status(500).json({ message: err.message });
  }
  res.send("hello world");
});
// Getting one
router.get("/:id", getSubscriber, (req, res) => {
  res.json(res.subscriber);
});

// Create one
// When creating a post route use a status 201 to say that you have been successful
router.post("/", async (req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel
  });
  try {
    const newSubscriber = await subscriber.save();
    // 201 means successfully created an object.
    res.status(201).json(newSubscriber);
  } catch (err) {
    //   if the user or client gives you bad data you wanna send a 400 error or status 400
    res.status(400).json({ message: err.message });
  }
});

// Updating one
// .patch will update one whereas put will update everything
router.patch("/:id", getSubscriber, async (req, res) => {
  if (req.body.name != null) {
    res.subscriber.name = req.body.name;
  }
  if (req.body.subscribedToChannel != null) {
    res.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }

  try {
    const updatedSubscriber = await res.subscriber.save();
    res.json(updatedSubscriber);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Deleting one

router.delete("/:id", getSubscriber, async (req, res) => {
  try {
    await res.subscriber.remove();
    res.json({ message: "deleted subscriber" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id);
    if (subscriber == null) {
      return res.status(404).json({ message: "cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.subscriber = subscriber;
  next();
}
module.exports = router;
