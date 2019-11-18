const express = require("express");
const router = express.Router();
const Kural = require("../models/kural");

//Create author
router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name != "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const allAuthors = await Kural.find({}, function(err, result) {
      if (err) throw err;
      console.log(result);
      res.send(result);
    });
  } catch (er) {
    console.log(er);
    res.send(er);
    //res.redirect("/");
  }
  res.end();
});

function getRandomInt() {
  min = Math.ceil(1);
  max = Math.floor(1330);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

module.exports = router;
