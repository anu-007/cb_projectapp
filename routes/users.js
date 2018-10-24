const express = require("express");
const router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../dbmodel/dbhandler");
const md5 = require("md5");
const multer = require("multer");
const uploads = multer({ dest: "./uploads/" });

// Register
router.get("/register", (req, res) => {
  res.render("register");
});

// Login
router.get("/login", (req, res) => {
  res.render("login", { user: req.username });
});

//my home
router.get("/myhome", (req, res) => {
  res.render("myhome", { usr: req.user });
});

//stories
router.get("/stories", (req, res) => {
  db.getImages((err, dta) => {
    if (err) console.log(err);
    res.render("stories", { dta }); //array of rows images
  });
});

router.use("/uploads", express.static(__dirname + "/../uploads"));

// Register User
router.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  // Validation
  req.checkBody("name", "Name is required").notEmpty();
  req.checkBody("email", "Email is required").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "Username is required").notEmpty();
  req.checkBody("password", "Password is required").notEmpty();
  req
    .checkBody("password2", "Passwords do not match")
    .equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    res.render("register", {
      errors: errors
    });
  } else {
    const newUser = {
      name: name,
      email: email,
      username: username,
      password: md5(password)
    };

    db.createUser(newUser, (err, data) => {
      if (err) {
        console.log(err);
        res.json({
          message: 'Something went wrong'
        });
      }
      console.log(data); //user here is undefined
    });

    req.flash("success_msg", "You are registered and can now login");

    res.redirect("/users/login");
  }
});

passport.use(
  new LocalStrategy((username, password, done) => {
    db.getUserByUsername(username, (err, result) => {
      if (err) {
        console.log(err);
        return;
      }

      if (!result) {
        return done(null, false, { message: "Unknown User" });
      }

      pass = md5(password);

      db.comparePassword(pass, result.username, (result) => {
        if (result == null)
          return done(null, false, { message: "Incorrect password" });
        else return done(null, result);
      });
    });
  })
);

passport.serializeUser((result, done) => {
  // console.log(result);           //returns id of user logged in
  done(null, result);
});

passport.deserializeUser((id, done) => {
  db.getUserById(id, (err, result) => {
    //    console.log(result);         //returns which packet is thrown
    done(err, result);
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/users/stories",
    failureRedirect: "/users/login",
    failureFlash: true
  }),
  (req, res) => {
    //  console.log('them');
    res.redirect("/users/stories");
  }
);

router.get("/logout", (req, res) => {
  req.logout();

  req.flash("success_msg", "You are logged out");

  res.redirect("/users/login");
});

router.post("/profile", uploads.single("avatar"), (req, res) => {
  //console.log(req.body);                //contain status
  const avatardata = {
    path: req.file.path,
    user: req.user.username
  };
  db.savefile(avatardata, (err, data) => {
    if (err) console.log(err);
    //       console.log(data);
  });
  res.status(204).end();
});

router.post("/status", (req, res) => {
  console.log(req.body.status);
  console.log(req.user.username); //contain status
  const avatardata = {
    user: req.user.username,
    status: req.body.status
  };
  db.statusUpdate(avatardata, (err, data) => {
    if (err) console.log(err);
    //       console.log(data);
  });
  req.flash("success_msg", "updated successfully");
  res.status(204).end();
});

router.post("/usrimg", uploads.single("art"), (req, res) => {
  const cat = Object.keys(req.body);
  const imgdata = {
    id: req.user.id,
    path: req.file.path,
    caption: req.body.caption,
    category: cat[0]
  };
  db.saveimg(imgdata, (err, data) => {
    if (err) console.log(err);
    //    console.log(data);
  });
  res.status(204).end();
});

router.post("/star", (req, res) => {
  //console.log(req.body);
  db.getusr(req.body[Object.keys(req.body)[0]], (err, data) => {
    if (err) console.log(err);
    const stardta = {
      num: data.nousr + 1,
      serial: req.body[Object.keys(req.body)[0]],
      avg: data.star + (Object.keys(req.body)[1] - data.star) / (data.nousr + 1)
    };
    db.rate(stardta, (err, data) => {
      if (err) console.log(err);
    });
  });

  res.status(204).end();
});

module.exports = router;
