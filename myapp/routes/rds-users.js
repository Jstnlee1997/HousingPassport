const mysql = require("mysql");
const util = require("util");
require("dotenv").config();

// Create connection with AWS RDS DB
const connection = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
});

// node native promisify
const query = util.promisify(connection.query).bind(connection);

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
async function addNewUser(name, email, password) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        var addNewUserQuery = `INSERT INTO Users(name,email,password)
                      VALUES(?,?,?)`;
        const result = await query(addNewUserQuery, [name, email, password]);
        resolve(result[0]);
      } catch (err) {
        reject(err);
      }
    })();
  });
}

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
async function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        var getUserByEmailQuery = `SELECT * FROM Users WHERE email=?`;
        const result = await query(getUserByEmailQuery, email);
        resolve(result[0]);
      } catch (err) {
        reject(err);
      }
    })();
  });
}
// Testing getUserByEmail Function
// const result = getUserByEmail("Justin@email.com").then((res) => {
//   var user = res;
//   var userId = res["id"];
//   console.log(" User: ", user);
//   console.log(userId);
// });

/* Function to GET user with respective id */
async function getUserById(id) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        var getUserByIdQuery = `SELECT * FROM Users WHERE id=?`;
        const result = await query(getUserByIdQuery, id);
        resolve(result[0]);
      } catch (err) {
        reject(err);
      }
    })();
  });
}
// Testing getUserById Function
// const result = getUserById(1).then((res) => {
//   return new Promise((resolve, reject) => {
//     (async () => {
//       try {
//         resolve(res.id);
//       } catch (err) {
//         reject(err);
//       }
//     })();
//   });
// });

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
  getUserByEmail,
  getUserById,
  updateAddressUsingEmail,
  deleteUserUsingEmail,
};