const { getUserWithEmail } = require("./rds-users");

const result = getUserWithEmail("Justin@email.com");
result.then((res) => console.log("Result:", res));
