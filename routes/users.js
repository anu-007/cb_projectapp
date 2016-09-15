var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../dbmodel/dbhandler');
var md5=require('md5');
var multer=require('multer');
var uploads=multer({ dest: './uploads/'});

// Register
router.get('/register', function(req, res){
  res.render('register');
});

// Login
router.get('/login', function(req, res){
  res.render('login',{user:req.username});
});

//my home
router.get('/myhome',function(req,res){
  res.render('myhome',{usr:req.user});
});

//stories
router.get('/stories',function(req,res){
  db.getImages(function(err,data){
  if(err)
    console.log(err);
    console.log(data);
    var dta=data
     res.render('stories',{dta:dta})                //array of rows images
    });
});

router.use('/uploads', express.static(__dirname + '/../uploads'))


// Register User
router.post('/register', function(req, res){
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Validation
  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

    if(errors){
    res.render('register',{
      errors:errors
    });
  } else {
    var newUser = {
      name: name,
      email:email,
      username: username,
      password: md5(password)
    };

    db.createUser(newUser, function(err, data){
      if(err)
        console.log(err);
      console.log(data);     //user here is undefined
    });

    req.flash('success_msg', 'You are registered and can now login');

    res.redirect('/users/login');
  }
});

passport.use(new LocalStrategy(
  function(username, password, done) {

   db.getUserByUsername(username,function(err,result){
     if(err)
      console.log(err);

     if(!result){
       return done(null,false,{message:'Unknown User'});
     }

     pass=md5(password);

      db.comparePassword(pass,result.username,function(result){
        if(result==null)
          return done(null,false,{message:'Incorrect password'});
        else
          return done(null,result);
       });

     });
    }
  ));

passport.serializeUser(function(result,done) {
 // console.log(result);           //returns id of user logged in
  done(null, result);
});

passport.deserializeUser(function(id,done ) {
  db.getUserById(id, function(err, result) {
//    console.log(result);         //returns which packet is thrown
    done(err, result);
  });
});

router.post('/login',passport.authenticate('local', {successRedirect:'/users/stories', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    console.log('them');
    res.redirect('/users/stories');
  });

router.get('/logout', function(req, res){
  req.logout();

  req.flash('success_msg', 'You are logged out');

  res.redirect('/users/login');
});

router.post('/profile', uploads.single('avatar'), function(req,res){
  console.log(req.body);                //contain caption
   var avatardata={
    path:req.file.path,
    user:req.user.username
   }
   db.savefile(avatardata,function(err,data){
       if(err)
        console.log(err);
        console.log(data);           //undefined
   });
  res.status(204).end();
});

router.post('/usrimg',uploads.single('art'),function(req,res){
    var cat=Object.keys(req.body);
     var imgdata={
      id:req.user.id,
      path:req.file.path,
      caption:req.body.caption,
      category:cat[0],
     }
     db.saveimg(imgdata,function(err,data){
      if(err)
        console.log(err);
  //    console.log(data);
     })
     res.status(204).end();
  });

router.post('/star',function(req,res){
  console.log("in the star end point");
//   console.log(req);

  var stardta={
    str:Object.keys(req.body)[0]
  }
  db.rate(stardta,function(err,data){
    if(err)
      console.log(err);
  //  console.log(data);
  })
 res.status(204).end();
});


 module.exports = router;
