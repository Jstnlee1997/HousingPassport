const mysql = require("mysql");
const { getUser } = require("./dynamo-users");
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
  let addUserQuery = `INSERT INTO Users(name,email,password)
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
  let getAllUsersQuery = `SELECT * FROM Users`;
  connection.query(getAllUsersQuery, (err, results, fields) => {
    if (err) {
      return console.error(err.message);
    }
    console.log(results);
  });
  connection.end();
}
// Testing getAllUsers Function
getAllUsers();

/* Function to GET user with respective email */
function getUserWithEmail(email) {
  let getUserWithEmailQuery = `SELECT * FROM Users WHERE email=?`;
  connection.query(getUserWithEmailQuery, email, (err, results, fields) => {
    if (err) {
      return console.log(err.message);
    }
    console.log(results);
  });
  connection.end();
}
// Testing getUserWithEmail Function
// getUserWithEmail("justin@email.com");

/* Function to UPDATE address using email */
function updateAddressUsingEmail(address, email) {
  let updateAddressUsingEmailQuery = `UPDATE Users
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
  let deleteRowUsingEmailQuery = `DELETE FROM Users WHERE email = ?`;
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
