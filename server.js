const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const morgan = require("morgan");

//Import server configuration
const config = require("./config/config");
const port = config.port;

//Import routes
const userRoutes = require("./routes/userRoutes");

//Connection to MongoDB
mongoose
  .connect(config.mongo, { useCreateIndex: true, useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(e => {
    console.log("Error while connecting to MongoDB");
    console.log(e);
  });

//Launch express
const app = express();

//Middlewares
//Morgan for traces
app.use(morgan("dev"));

//BodyParser moddleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//CookieParser middleware
app.use(cookieParser());

//Cors middleware
app.use(cors());

// DEBUG
// app.use((req, res, next) => {
//   console.log(req.headers);
//   console.log(req.body);
//   next();
// });

//Passport middleware
app.use(passport.initialize());

//Passport configuration
require("./config/passport")(passport);

//User routes
app.use("/user", userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});
