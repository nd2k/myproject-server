const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

// Import user model
const user = require("../models/user");

// @route   POST user/register
// @desc    Register user
// @access  Public
exports.register = (req, res) => {
  // Define the object newUser
  const newUser = new user({
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password,
    avatar: req.body.avatar
  });

  const confirmedPassword = req.body.confirmedPassword;

  // Check mandatory fields
  if (!newUser.email && newUser.password && confirmedPassword) {
    console.log("check mandatory fields");
    res.status(422).json({
      message: "email & password are required"
    });
  } else if (newUser.password !== confirmedPassword) {
    console.log("check passwords");
    res.status(422).json({
      message: "Invalid password confirmation"
    });
  } else {
    // Crypt the password and save in MongoDB
    const saltRound = 10;
    bcrypt.genSalt(saltRound, (e, salt) => {
      if (e) throw e;
      bcrypt.hash(newUser.password, salt, (e, hash) => {
        if (e) throw e;
        newUser.password = hash;
        newUser
          .save()
          .then(user =>
            res.status(200).json({
              message: "User created",
              object: user
            })
          )
          .catch(function(e) {
            if (e.code === 11000) {
              res.status(400).json({
                message: "User already existing",
                object: e
              });
            } else {
              res.status(400).json({
                message: "Error, user not created",
                object: e
              });
            }
          });
      });
    });
  }
};

// @route   GET user/login
// @desc    Login user
// @access  Public
exports.login = (req, res) => {
  //User data from login page
  const login = {
    email: req.body.email,
    password: req.body.password
  };

  //Find user by email
  user.findOne({ email: login.email }).then(user => {
    //Check for user
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        object: user
      });
    }
    //Compare & decrypt password
    bcrypt.compare(login.password, user.password).then(isMatch => {
      if (isMatch) {
        //Login user matches user in DB
        const matchedUser = {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          avatar: user.avatar
        };

        //Sign token
        jwt.sign(
          matchedUser,
          config.secretOrKey,
          { expiresIn: 3600 },
          (e, token) => {
            if (e) {
              return res.status(400).json({
                message: "Token not created",
                object: e
              });
            }
            res.status(200).json({
              message: "Token created",
              token: "Bearer " + token,
              object: matchedUser
            });
          }
        );
      } else {
        return res.status(400).json({
          message: "Invalid password"
        });
      }
    });
  });
};
