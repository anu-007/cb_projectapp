var mysql=require('mysql');

let connection={};
const createConnection=function(){
connection = mysql.createConnection(
{
  host     : 'localhost',
  user     : 'anubhuti',
  database : 'cbprojectdb'
});
return connection;
};

module.exports={

createUser:function(newUser,doneCb){  
 const conn= createConnection();
  conn.connect();
  var queryString="INSERT INTO usersinfo (name,email,username,password)VALUES('"+newUser.name+"','"+newUser.email+"','"+newUser.username+"','"+newUser.password+"');";
   conn.query(queryString, function (err, result) {
        if (err)
        	console.log(err);
        doneCb(err,result);    //result contains packet returned by mysql on succesfull addition of entry
    });
    conn.end();
},

getUserByUsername:function(username,doneCb){
	const conn=createConnection();
	conn.connect();
	var queryString="SELECT * FROM usersinfo WHERE username='"+username+"';";
	conn.query(queryString,function(err,row,field){
		if(err)
			console.log(err);
		doneCb(err,row[0]);        //row[0] contains full data packet of the searched entry
	});
	conn.end();
},

comparePassword:function(candidatepassword,username,doneCb){
	const conn=createConnection();
	conn.connect();
	var queryString="SELECT password FROM usersinfo WHERE username='"+username+"';";
	conn.query(queryString,function(err,row,field){
		if(err)
			console.log(err);

        if(row[0].password==candidatepassword)
         doneCb(1);
        else
          doneCb(0);
	});
	conn.end();
},

getUserById:function(serial,doneCb){
	const conn=createConnection();
	conn.connect();
	var queryString="SELECT * FROM usersinfo WHERE id="+serial+";";
	conn.query(queryString,function(err,row,field){
		if(err)
			console.log(err);
		doneCb(err,row[0]);
	})
	conn.end();
}

}