const DBpool = require("../models/db");
const {
  isEmailExist,
  hashPassword,
  verifyPassword,
  findUser,
  checkTableExistence,
} = require("./users.functions");

exports.userSignup = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);

  const connection = await DBpool.getConnection();
  try {
    // Check if the table exists
    const tableExists = await checkTableExistence('user_table');
    if (tableExists) {
      // Check if the email already exists
      const emailExists = await isEmailExist(email);
      if (emailExists) {
        return res.status(401).send(`Email '${email}' already exists.`);
      }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS user_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createTableSQL);

    // Insert the user data
    const insertDataSQL = `INSERT INTO user_table (email, password) VALUES (?, ?)`;
    await connection.query(insertDataSQL, [email, hashedPassword]);

    // Success response
    return res.status(200).send("User data saved successfully.");
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).send("Internal Server Error.");
  } finally {
    connection.release();
  }
};

exports.userLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(email);
  try {
    const user = await findUser(email);
    if (user.length === 0) {
      return res.status(401).send(`Email : '${email}' is not there.`);
    }

    const storedHash = user[0].password;

    const validUser = await verifyPassword(password, storedHash);

    if (validUser) {
      return res.status(200).send("Login successful.");
    } else {
      return res.status(401).send("Invalid password.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Internal Server Error.");
  }
};
