const router = require("express").Router();
const Search = require("../models/SearchResults");

router.get("/history/:uid", async (req, res) => {
  const uid = req.params.uid;
  try {
    const search = await Search.find(
      { userId: uid },
      { results: 0, __v: 0 }
    ).sort({ $natural: -1 });
    res.json(search);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/history/:uid/:id", async (req, res) => {
  const uid = req.params.uid;
  const id = req.params.id;
  try {
    const searchDoc = await Search.find({ userId: uid, _id: id });
    console.log(searchDoc);
    res.json(searchDoc);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

router.delete("/history/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const searchDoc = await Search.deleteOne({ _id: id });
    console.log(searchDoc);
    res.json(searchDoc);
  } catch (err) {
    res.status(401).json({ message: err });
  }
});

router.get("/chart/:freq", async (req, res) => {
  const freq = req.params.freq;
  try {
    let data;
    let format = "%Y-%m-%d";
    if (freq === "daily") {
      format = "%Y-%m-%d";
    } else if (freq === "weekly") {
      format = "%Y-%U";
    } else if (freq === "monthly") {
      format = "%Y-%m";
    }
    data = await Search.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: format, date: "$searchedAt" } },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

module.exports = router;
//previous code lines = 96
