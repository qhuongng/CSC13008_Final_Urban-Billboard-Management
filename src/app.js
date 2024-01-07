const express = require("express");
const dotenv = require("dotenv");
const routes = require("./Routers");
const bodyParser = require("body-parser");
const path = require("path");
const handlebars = require("express-handlebars");
//---------
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

routes(app);

app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "Views"));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
