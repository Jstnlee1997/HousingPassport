if (process.env.NODE_ENV != "PRODUCTION") {
  require("dotenv").config();
}

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
var flash = require("express-flash");
var session = require("express-session");
var methodOverride = require("method-override");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var newUserRouter = require("./routes/new-user");
var epcRouter = require("./routes/epc");
var recommendationRouter = require("./routes/recommendation");
var registerRouter = require("./routes/register");
var loginRouter = require("./routes/login");
var initializePassport = require("./routes/passport-config");
// Need to be able to find user and return an USER object
initializePassport(passport);

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));

app.use("/", indexRouter.router);
app.use("/users", usersRouter);
app.use("/new-user", newUserRouter);
app.use("/epc", epcRouter.router);
app.use("/recommendation", recommendationRouter);
app.use("/register", registerRouter);
app.use("/login", loginRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
