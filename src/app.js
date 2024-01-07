const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./Routers");
const bodyParser = require("body-parser");
const path = require("path");
const handlebars = require("express-handlebars");
const session = require("express-session");
const reportImg = require('./Models/Image');
//---------
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
//app.use("/static", express.static("static"));

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

// app.get('/images/:id', async (req, res) => {
//   const imageId = req.params.id;

//   try {
//     const image = await reportImg.findById(imageId);

//     if (!image) {
//       return res.status(404).send('Image not found');
//     }

//     res.contentType(image.contentType);
//     res.send(image.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Internal Server Error');
//   }
// });

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
