const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const contact = require("./script")
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const session = require('express-session');
// const flash = require('connect-flash');



mongo_url = 'mongodb://127.0.0.1:27017/portfolio'

async function main() {
  await mongoose.connect(mongo_url);

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

main()
    .then(() => console.log("connected to database"))
    .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.static(path.join(__dirname, "/public")));
app.engine("ejs", ejsMate)

app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencodeda
app.use(express.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true}))


app.use(session({
  secret: 'yourSecretKey', // change this to a strong secret
  resave: false,
  saveUninitialized: false
}));

// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.success_msg = req.flash('success_msg');
//   res.locals.error_msg = req.flash('error_msg');
//   next();
// });



app.get("/", (req, res) => {
    res.render("portfolio/home.ejs");
})



app.get("/skills", (req, res) => {
    res.render("portfolio/skills.ejs");
})

app.get("/education", (req, res) => {
    res.render("portfolio/education.ejs");
});

// 

app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // 1. Save to database
    await contact.insertMany([{ name, email, message }]); // note the array for insertMany

    // 2. Create transporter
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "piyushbalotiya4@gmail.com",
        pass: "8433Piyu_@", // your Gmail app password, no spaces
      },
    });

    // 3. Prepare mail options
    let mailOptions = {
      from: 'piyushbalotiya4@gmail.com',
      to: email,
      subject: "New Contact Form Submission",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message} Thank you for registration`,
    };

    // 4. Send email
    await transporter.sendMail(mailOptions);

    // 5. Send one success response
    //  req.flash('success_msg', 'You have registered successfully!');
    // res.status(200).send("Form submitted and email sent successfully!");
    res.send("successfully registered");
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).send("Something went wrong. Please try again.");
  }
});


app.listen(8080, () => {
    console.log("server is listening")
});

