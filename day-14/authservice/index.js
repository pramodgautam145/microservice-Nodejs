const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
const secret = "OurSecretKey";

module.exports.secret = secret;

const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/authdb",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`Auth-Service DB Connected`);
  },
);

app.use(express.json());

// /auth/register
app.post("/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.json({ message: "User already existing !" });
  } else {
    const newUser = new User({ email, name, password });
    newUser.save();
    return res.json(newUser);
  }
});

// /auth/signin
app.post("/auth/signin", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ message: "User does not exist !" });
  } else {
    if (password !== user.password) {
      return res.json({ message: "Password Incorrect !" });
    }

    // payload - email & name
    // sign the token (generate) with secret key
    const payload = { email, name: user.name };
    jwt.sign(payload, secret, { expiresIn: "2Days" }, (err, token) => {
      if (err) console.log(er);
      else return res.json({ token });
    });
  }
});

app.listen(4003, () => {
  console.log("Auth-Service running at port 4003 !");
});
