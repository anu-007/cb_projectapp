const mysql = require("mysql");

let connection = {};

const createConnection = () => {
  connection = mysql.createConnection({
    host: "localhost",
    user: "anubhuti",
    database: "cbprojectdb"
  });
  return connection;
};

module.exports = {
  createUser: (newUser, doneCb) => {
    const conn = createConnection();
    conn.connect();
    const queryString = `INSERT INTO usersinfo (name,email,username,password)VALUES('${
      newUser.name
    }','${newUser.email}','${newUser.username}','${newUser.password}');`;
    conn.query(queryString, function(err, result) {
      if (err) {
        console.log(err);
      }
      doneCb(err, result); //result contains packet returned by mysql on succesfull addition of entry
    });
    conn.end();
  },

  getUserByUsername: (username, doneCb) => {
    const conn = createConnection();
    conn.connect();
    const queryString =
      "SELECT * FROM usersinfo WHERE username='" + username + "';";
    conn.query(queryString, (err, row, field) => {
      if (err) console.log(err);
      doneCb(err, row[0]); //row[0] contains full data packet of the searched entry
    });
    conn.end();
  },

  comparePassword: (candidatepassword, username, doneCb) => {
    const conn = createConnection();
    conn.connect();
    var queryString =
      "SELECT usersinfo.* FROM usersinfo WHERE username = '" + username + "';";
    conn.query(queryString, function(err, row, field) {
      if (err) console.log(err);
      if (row[0].password === candidatepassword) doneCb(row[0].id);
      else doneCb();
    });
    conn.end();
  },

  getUserById: (serial, doneCb) => {
    const conn = createConnection();
    conn.connect();
    var queryString = "SELECT * FROM usersinfo WHERE id=" + serial + ";";
    conn.query(queryString, function(err, row, field) {
      if (err) console.log(err);
      doneCb(err, row[0]);
    });
    conn.end();
  },

  savefile: (userfile, doneCb) => {
    const conn = createConnection();
    conn.connect();
    var queryString =
      "UPDATE usersinfo SET avatar='" +
      userfile.path +
      "',status='" +
      userfile.Status +
      "' WHERE username='" +
      userfile.user +
      "';";
    conn.query(queryString, (err, row, field) => {
      if (err) console.log(err);
      doneCb(err, row[0]);
    });
    conn.end();
  },

  saveimg: (userimg, doneCb) => {
    const conn = createConnection();
    conn.connect();
    var queryString =
      "INSERT INTO usruploads (id,image,category,caption)VALUES(" +
      userimg.id +
      ",'" +
      userimg.path +
      "','" +
      userimg.category +
      "','" +
      userimg.caption +
      "') ;";
    conn.query(queryString, (err, row, field) => {
      if (err) console.log(err);
      doneCb(err, row[0]);
    });
    conn.end();
  },

  getImages: (doneCb) => {
    const conn = createConnection();
    conn.connect();
    var queryString =
      "SELECT usersinfo.username, usersinfo.avatar, usruploads.image, usruploads.caption, usruploads.category, usruploads.serial, usruploads.star, usruploads.nousr FROM usersinfo, usruploads WHERE usersinfo.id = usruploads.id ORDER BY serial DESC";
    conn.query(queryString, (err, row, field) => {
      if (err) console.log(err);
      doneCb(err, row);
    });
    conn.end();
  },

  rate: (val, doneCb) => {
    const conn = createConnection();
    conn.connect();
    var queryString =
      "UPDATE usruploads SET star=" +
      val.avg +
      ",nousr=" +
      val.num +
      " WHERE serial=" +
      val.serial +
      ";";
    conn.query(queryString, (err, row, field) => {
      if (err) console.log(err);
    });
    conn.end();
  },

  statusUpdate: (userfile, doneCb) => {
    const conn = createConnection();
    conn.connect();
    var queryString =
      "UPDATE usersinfo SET status='" +
      userfile.status +
      "' WHERE username='" +
      userfile.user +
      "';";
    conn.query(queryString, (err, row, field) => {
      if (err) console.log(err);
      doneCb(err, row[0]);
    });
    conn.end();
  },

  getusr: (serial, doneCb) => {
    const conn = createConnection();
    conn.connect();
    var queryString =
      "select star,nousr from usruploads WHERE serial=" + serial + ";";
    conn.query(queryString, (err, row, field) => {
      if (err) console.log(err);
      doneCb(err, row[0]);
    });
    conn.end();
  },

  gettop: (doneCb) => {
    const conn = createConnection();
    conn.connect();
    var queryString =
      "SELECT image,caption FROM usruploads where nousr >= 2 ORDER BY star DESC LIMIT 7;";
    conn.query(queryString, (err, row, field) => {
      if (err) console.log(err);
      doneCb(err, row);
    });
    conn.end();
  }
};
