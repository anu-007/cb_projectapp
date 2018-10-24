const express = require("express");
const db = require("../dbmodel/dbhandler");
const router = express.Router();

router.use("/uploads", express.static(__dirname + "/../uploads"));

router.get("/", (req, res) => {
  db.gettop((err, dta) => {
    if (err) {
      console.log(err);
      res.json({
        message: 'Some error occurred'
      });
    }
    res.render("index", { dta });
  });
});

module.exports = router;
