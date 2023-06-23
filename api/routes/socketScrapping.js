const express = require("express");
const axios = require("axios");
const router = express.Router();
const mongoose = require("mongoose");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URL);

const processBSearch = async ({ body }) => {
  console.log("body", body);
  //csrf token verification


  try {
    
    const results = await axios.post(
      "http://localhost:4000/internalScrapping/scrapeB",
      body
    );
    return results.data;
  } catch (err) {
    console.log("Error scraping Google search:", err);
    return { err: "Internal server error." };
  }
};

const processGSearch = async ({body}) => {
  console.log("body-google", body);
  try {
    const results = await axios.post(
      "http://localhost:4000/internalScrapping/scrapeG",
      body
    );
    return results.data;
  } catch (err) {
    console.log("Error scraping Google search:", err);
    return { error: "Internal server error." };
  }
};

module.exports = { processBSearch, processGSearch };
