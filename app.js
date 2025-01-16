const express = require("express"),
  mongoose = require("mongoose"),
  passport = require("passport"),
  bodyParser = require("body-parser"),
  LocalStrategy = require("passport-local"),
  passportLocalMongoose = require("passport-local-mongoose"),
  dotenv = require("dotenv");

const User = require("./models/User");
let app = express();

// Load environment variables from the .env file
dotenv.config();

// MongoDB Atlas Connection String from environment variables
const mongoAtlasUri = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(mongoAtlasUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB Atlas connected successfully"))
  .catch(err => console.log("MongoDB connection error: ", err));

// Set view engine to EJS
app.set("view engine", "ejs");

// Middleware for parsing form data
app.use(bodyParser.urlencoded({ extended: true }));

// Express session configuration
app.use(
  require("express-session")({
    secret: "Rusty is a dog", // Secret for session encryption
    resave: false,
    saveUninitialized: false,
  })
);

// Passport.js middleware initialization
app.use(passport.initialize());
app.use(passport.session());

// Passport.js local strategy configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================
// ROUTES
//=====================

// Home page route
app.get("/", function (req, res) {
  res.render("home");
});

// Secret page (only accessible if logged in)
app.get("/secret", isLoggedIn, function (req, res) {
  res.render("secret");
});

// Registration form route
app.get("/register", function (req, res) {
  res.render("register");
});

// Handling user registration
app.post("/register", async (req, res) => {
  try {
    const newUser = new User({ username: req.body.username });
    await User.register(newUser, req.body.password);
    res.redirect("/login");
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login form route
app.get("/login", function (req, res) {
  res.render("login");
});

// Handling user login
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login",
  })
);

// Handling user logout
app.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

// Start the server
let port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
