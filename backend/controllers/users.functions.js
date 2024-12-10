const DBpool = require("../models/db");
const bcrypt = require("bcrypt");

exports.isEmailExist = async (email) => {
  try {
    const [rows] = await DBpool.query(
      `SELECT email FROM user_table WHERE email = ?`,
      [email]
    );
    return rows.length > 0;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw error; // Ensure the error propagates.
  }
};

// Function to hash a password
exports.hashPassword = async (password) => {
  try {
    const saltRounds = 10; // Adjust as needed, higher rounds = more security but slower
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

// Function to verify a password
exports.verifyPassword = async (inputPassword, storedHash) => {
  try {
    const match = await bcrypt.compare(inputPassword, storedHash);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    throw error;
  }
};

exports.findUser = async (email) => {
  try {
    const [rows] = await DBpool.query(
      `SELECT password FROM user_table WHERE email = ?`,
      [email]
    );
    return rows;
  } catch (error) {
    console.error("Error finding user:", error);
    throw error;
  }
};

exports.checkTableExistence = async (tableName) => {
  try {
    const [rows] = await DBpool.query(`SHOW TABLES LIKE ?`, [tableName]);
    return rows.length > 0;
  } catch (error) {
    console.error(`Error creating or updating table:`, error);
  }
};