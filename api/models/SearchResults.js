const mongoose = require("mongoose");

const SearchSchema = new mongoose.Schema({
  userId: { type: String },
  fingerPrint: { type: String},
  results: { type: Object},
  searchedAt: { type: Date, default: Date.now },
  searchedFrom: { type: String },
  query: { type: String },
});

const SearchModel = mongoose.model("Search", SearchSchema);

module.exports = SearchModel;
