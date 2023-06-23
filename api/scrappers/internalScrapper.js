const express = require("express");
const scrapeGoogle = require("./googleScraper");
const scrapeBing = require("./bingScrapper");
const SearchModel = require("../models/SearchResults");

const userActions = new Map();
let ongoingActionsCount = 0;
const router = express.Router();

// Middleware for actions limit
router.use((req, res, next) => {
  ongoingActionsCount++;
  const { userId } = req.body;
  if (userActions.get(userId) >= 2 || ongoingActionsCount >= 10) {
    return res
      .status(429)
      .json({ error: "Too many actions. Please try again later." });
  } // Check if the user has exceeded the maximum actions limit
  userActions.set(userId, (userActions.get(userId) || 0) + 1); // Increment user
  next();
});

router.post("/:source", async (req, res) => {
  const { userId, query, fingerPrint } = req.body;
  const { source } = req.params;
  try {
    const results =
      source === "scrapeG"
        ? await scrapeGoogle(query, 3)
        : await scrapeBing(query, 3);
    await SearchModel.create({
      fingerPrint: fingerPrint,
      userId: userId,
      results: results,
      searchedFrom: source==="scrapeG"?"Google":"Bing",
      query: query,
    });

    res.json(results);
  } catch (err) {
    console.error("Error scraping search:", err);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    userActions.set(userId, userActions.get(userId) - 1);
    ongoingActionsCount--;
  }
});

module.exports = router;

//previous code lines = 100