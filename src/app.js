const express = require("express");
const dotenv = require("dotenv");
const routes = require("./Routers");
const bodyParser = require("body-parser");
const path = require("path");
const handlebars = require("express-handlebars");
const cors = require("cors");
//---------
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));
app.use(cors());

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

app.post('/verify-recaptcha', async (req, res) => {
  const recaptchaVerifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
  const recaptchaSecretKey = '6LewcUkpAAAAAPO-7HOQAFSEvdKHC_gOfsvXh9oD';

  try {
    const recaptchaVerificationResponse = await fetch(recaptchaVerifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: recaptchaSecretKey,
        response: req.body.token,
      }),
    });

    const recaptchaVerificationData = await recaptchaVerificationResponse.json();

    if (!recaptchaVerificationData.success) {
      res.status(403).json({ success: false });
    } else {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
