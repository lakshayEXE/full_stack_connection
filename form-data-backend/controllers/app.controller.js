const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db.js")
const User = require("../models/users.model");
const JWT_SECRET = "mERi_key"; // It's recommended to store this in an environment variable

/**
 * Handles new user registration.
 */

exports.register = [
  // 1. Validation middleware
  body("name").trim().notEmpty().withMessage("Name is required"), // Corrected syntax and typo
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  // 2. Route handler
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.query(
      "INSERT INTO users (name , email , password) VALUES (? ,? ,?)",
      [name, email, hashedPassword],
      (err, result) => {
        // Check for duplicate email error specifically
        if (err && err.code === "ER_DUP_ENTRY") {
          return res.status(409).json({ error: "Email already in use" });
        }
        // Handle other potential database errors
        if (err) {
          console.error("Database Error:", err); // Log the actual error for debugging
          return res
            .status(500)
            .json({ error: "Server error during registration" });
        }
        // On success
        res
          .status(201)
          .json({ message: "User registered successfully", result });
      }
    );
  },
];

exports.login = [
  // 1. Validation middleware
  
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),

  // 2. Route handler
  (req, res) => {
    const errors = validationResult(req);
    console.log("Login request received", req.body);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        console.error(err); // Helpful for debugging
        return res.status(500).json({ error: "Server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = results[0];

      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login Successful", token });
    });
  },
];

/**
 * Fetches the profile of the authenticated user.
 */

exports.dashboard = (req, res) => {
const userId = req.user.id;

const query = `
  SELECT users.name , users.id, users.email, user_details.address,
         user_details.dob, user_details.designation, user_details.phone
  FROM users
  LEFT JOIN user_details ON users.id = user_details.id
  WHERE users.id = ?`;

  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User Not Found' });
    }

    // ✅ Only one res.json() here
    res.json({
      message: 'Accessed protected dashboard route',
      user: results[0]
    });
  });
};



  exports.updateProfile = (req,res)=>{
    const userId = req.user.id;
    const {email,address,designation , dob ,phone} = req.body;

    const query = `
    INSERT INTO user_details (id , address,designation , dob , phone)
    VALUES (? ,? ,?,?,?)
    ON DUPLICATE KEY UPDATE 
    address = VALUES(address),
    designation = VALUES(designation),
    dob = VALUES(dob),
    phone = VALUES(phone)`;
    

    db.query(query,[userId , address , designation , dob , phone] ,(err,result)=>{
      // console.log(result,"---result");
      
       if(err){
        console.error('Update mei error aya query yah parametes check kro' , err);
        return res.status(500).json({error:"Update failed"});
       }

       res.json({message:'Profile updated successfully'})
    })
  }