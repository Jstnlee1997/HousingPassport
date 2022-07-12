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
        console.log("New User Id: " + result.insertId);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    })();
  });
}
// Testing addNewUser Function
// const result = addNewUser("Dog", "dog@email.com", "dog").then((res) => {});

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
async function updateAddressUsingEmail(address, email) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        var updateAddressUsingEmailQuery = `UPDATE Users
                              SET address = ?
                              WHERE email = ?`;
        const result = await query(updateAddressUsingEmailQuery, [
          address,
          email,
        ]);
        console.log("Rows affected: ", result.affectedRows);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    })();
  });
}
// Testing updateAddressUsingEmail Function
// updateAddressUsingEmail("51 Kitchen Ave", "justin@email.com");

/* Function to UPDATE address using id */
async function updateAddressAndLmkKeyUsingId(address, lmkKey, id) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        var updateAddressAndLmkKeyUsingIdQuery = `UPDATE Users
                              SET address = ?, lmkKey = ?
                              WHERE id = ?`;
        const result = await query(updateAddressAndLmkKeyUsingIdQuery, [
          address,
          lmkKey,
          id,
        ]);
        console.log("Rows affected: ", result.affectedRows);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    })();
  });
}
// Testing updateAddressUsingEmail Function
// updateAddressAndLmkKeyUsingId("43 King's Road", "random-lmk-key", 22);

/* Function to DELETE row using email */
async function deleteUserUsingEmail(email) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        var deleteRowUsingEmailQuery = `DELETE FROM Users WHERE email = ?`;
        const result = await query(deleteRowUsingEmailQuery, email);
        console.log("Deleted Row(s): ", result.affectedRows);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    })();
  });
}
// Testing deleteUserUsingEmail Function
// deleteUserUsingEmail("a@a");

module.exports = {
  addNewUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  updateAddressUsingEmail,
  updateAddressAndLmkKeyUsingId,
  deleteUserUsingEmail,
};
