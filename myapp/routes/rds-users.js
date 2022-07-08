const mysql = require("mysql");
require("dotenv").config();

// Create connection with AWS RDS DB
const connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
});

/* TEST CONNECTION */
// connection.connect((err) => {
//   if (err) {
//     console.log(err.message);
//     return;
//   }
//   console.log("Database connected.");

//   connection.end((err) => {
//     if (err) {
//       return console.log(err.message);
//     }
//   });
// });

/* Function to INSERT new user into Users table */
function addNewUser(name, email, password) {
  var addUserQuery = `INSERT INTO Users(name,email,password)
                      VALUES(?,?,?)`;
  //  execute insert statement
  connection.query(
    addUserQuery,
    [name, email, password],
    (err, results, fields) => {
      if (err) {
        return console.error(err.message);
      }
      // get user id
      console.log("New User Id: " + results.insertId);
    }
  );
  connection.end();
}
// Testing addNewUser Function
// addNewUser("Miqi", "miqi@email.com", "password321");

/* Function to GET all users in Users table */
function getAllUsers() {
  var getAllUsersQuery = `SELECT * FROM Users`;
  connection.query(getAllUsersQuery, (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(results);
  });
  connection.end();
}
// Testing getAllUsers Function
// getAllUsers();

/* Function to GET user with respective email */
async function getUserWithEmail(email) {
  var getUserWithEmailQuery = `SELECT * FROM Users WHERE email=?`;
  return new Promise(function (resolve, reject) {
    connection.query(getUserWithEmailQuery, email, (err, results, fields) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
    connection.end();
  });
}
// Testing getUserWithEmail Function
const result = getUserWithEmail("Justin@email.com");
result.then((res) => console.log("Result:", res["id"]));

/* Function to UPDATE address using email */
function updateAddressUsingEmail(address, email) {
  var updateAddressUsingEmailQuery = `UPDATE Users
                        SET address = ?
                        WHERE email = ?`;
  connection.query(
    updateAddressUsingEmailQuery,
    [address, email],
    (err, results, fields) => {
      if (err) {
        return console.log(err.message);
      }
      console.log("Rows affected: ", results.affectedRows);
    }
  );
  connection.end();
}
// Testing updateAddressUsingEmail Function
// updateAddressUsingEmail("51 Kitchen Ave", "miqi@email.com");

/* Function to DELETE row using email */
function deleteUserUsingEmail(email) {
  var deleteRowUsingEmailQuery = `DELETE FROM Users WHERE email = ?`;
  connection.query(deleteRowUsingEmailQuery, email, (err, results, fields) => {
    if (err) {
      return console.log(err.message);
    }
    console.log("Deleted Row(s): ", results.affectedRows);
  });
  connection.end();
}
// Testing deleteUserUsingEmail Function
// deleteUserUsingEmail("miqi@email.com");

module.exports = {
  addNewUser,
  getAllUsers,
  getUserWithEmail,
  updateAddressUsingEmail,
  deleteUserUsingEmail,
};
