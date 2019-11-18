const express = require("express");
const router = express.Router();
const User = require("../models/user");

//Create author
router.post("/create", async (req, res) => {
  const author = new User({
    name: req.body.name,
    phone: req.body.phone
  });
  try {
    const queryParm = { phone: req.body.phone };
    const exist = await User.find(queryParm);
    if (exist && exist.length != 0) {
      //User Already exist
      res.send("User already exist");
    } else {
      //Save user
      await author.save();
      res.send("User saved successfully");
    }
  } catch (e) {
    res.send("Error in user creation" + e);
  }
  res.end();
});

router.get("/user", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name != "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const allAuthors = await User.find({}, function(err, result) {
      if (err) throw err;
      console.log("result", result);
      res.send(result);
    });
  } catch (er) {
    console.log(er);
    //res.redirect("/");
  }
  res.end();
});

module.exports = router;

// client side sample
// var querystring = require('querystring');
// var request = require('request');

// var form = {
//     username: 'usr',
//     password: 'pwd',
//     opaque: 'opaque',
//     logintype: '1'
// };

// var formData = querystring.stringify(form);
// var contentLength = formData.length;

// request({
//     headers: {
//       'Content-Length': contentLength,
//       'Content-Type': 'application/x-www-form-urlencoded'
//     },
//     uri: 'http://myUrl',
//     body: formData,
//     method: 'POST'
//   }, function (err, res, body) {
//     //it works!
//   });
