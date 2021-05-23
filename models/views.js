const mongoose = require("mongoose");

const countViewsSchema = new mongoose.Schema({
  totViews: { type: Number, required: true },
});

const CountViews = mongoose.model("TotalViews", countViewsSchema);

exports.CountViews = CountViews;
