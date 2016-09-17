const express=require('express');
var db = require('../dbmodel/dbhandler');
var router=express.Router();

router.use('/uploads', express.static(__dirname + '/../uploads'));

router.get('/',function(req,res){
	db.gettop(function(err,data){
       if(err)
       	console.log(err);
       var dta=data;
       res.render('index',{dta:dta});
	})
})

module.exports=router;
