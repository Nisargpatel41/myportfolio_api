const express = require("express");
const { CountViews } = require("../models/views");

const router = express.Router();

router.get("/", (req, res) => {
  CountViews.find({})
    .then((result) => {
      //   console.log(result);
      res.status(200).send(result);
    })
    .catch((err) => {
      //   console.log(err);
      res.status(503).send("something failed");
    });
});

router.put("/", (req, res) => {
  CountViews.findById("5ed675303ba4350f50f793c8")
    .then((viewsDoc) => {
      //   console.log("totviewsfromdb", viewsDoc.totViews);
      const newView = viewsDoc.totViews + 1;
      //   console.log("newview", newView);

      return CountViews.updateOne(
        { _id: "5ed675303ba4350f50f793c8" },
        { totViews: newView }
      );
    })
    .then((result) => {
      //   console.log(result);
      res.status(200).send("views updated");
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
