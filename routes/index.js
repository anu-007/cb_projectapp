const express=require('express');
var router=express.Router();

router.use('/uploads', express.static(__dirname + '/../uploads'));

router.get('/',function(req,res){
	res.render('index');
})

module.exports=router;