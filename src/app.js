const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./Routers");
const bodyParser = require("body-parser");
const path = require("path");
const handlebars = require("express-handlebars");
const session = require("express-session");
const cors = require('cors');
//---------
dotenv.config();

const app = express();
const corsOption = {
  origin: "http://localhost:3200",
  credentials: true
}
app.use(cors(corsOption));// sau này chỉnh lại thành đg dẫn mặc định
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}));

app.use(express.static(__dirname + "/public"));
//app.use("/static", express.static("static"));

app.use(function (req, res, next) {
  if (typeof (req.session.auth) === 'undefined') {
    req.session.auth = false;
  }

  res.locals.auth = req.session.auth;
  res.locals.authUser = req.session.authUser;
  next();
});

routes(app);

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: 'main',
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "Views"));

app.get("/", (req, res) => {
  if (res.locals.auth == false) {
    res.render("viewUser/login", {
      layout: false
    });
  } else {
    res.render("index");
  }
});

mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => {
    console.log("Connect DB success");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
