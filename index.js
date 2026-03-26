const express = require("express");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const app = express();

const PORT = 3000;
const HOST = "127.0.0.1";

// ================= MIDDLEWARE =================

// Serve static files
app.use(express.static("public/"));

// Parse JSON & Form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS view engine
app.set("view engine", "ejs");

// ================= DATABASE =================
const connection = require("./config/db");

// ================= SESSION CONFIG =================
app.use(
  session({
    secret: "nikhilsecret",
    resave: false,
    saveUninitialized: false,
  }),
);

// ================= MODEL =================
const userSchema = require("./model/userSchema");

// ================= ROUTES =================

// Login page
app.get("/", (req, res) => {
  res.render("login");
});

// ================= LOGIN =================
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const isUserExists = await userSchema.findOne({ username });

    if (!isUserExists) {
      return res.send(
        `<script>alert('User not exists!'); window.location.assign('/')</script>`,
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      isUserExists.password,
    );

    if (!isPasswordMatch) {
      return res.send(
        `<script>alert('Invalid password!'); window.location.assign('/')</script>`,
      );
    }

    req.session.loginId = isUserExists._id;

    console.log("Login Successfully");

    return res.redirect("/dashboard");
  } catch (err) {
    console.log("Internal Server Error", err);
    return res.status(500).send("Something went wrong");
  }
});

// ================= DASHBOARD =================
app.get("/dashboard", async (req, res) => {
  try {
    if (!req.session.loginId) {
      return res.redirect("/");
    }

    const user = await userSchema.findById(req.session.loginId);

    res.render("dashboard", { username: user.username });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

// ================= LOGOUT =================
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

// ================= SIGNUP =================
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, useremail, password, phone } = req.body;

    if (!username || !useremail || !password || !phone) {
      return res.send(`<script>
        alert('All fields are required');
        window.location.href='/signup';
      </script>`);
    }

    // Stored all the user in session
    req.session.userDetails = req.body;

    let otp = Math.floor(1000 + Math.random() * 9000); // proper 4 digit otp

    req.session.OTP = otp;

    console.log("Generated OTP:", otp);

    res.send(
      `<script>
        alert('Your OTP is ${otp}');
        window.location.assign('/otppage');
      </script>`,
    );

    // Hash password before saving
    // const hashpassword = await bcrypt.hash(password, 10);

    // const result = new userSchema({
    //   username,
    //   useremail,
    //   password: hashpassword,
    //   phone,
    // });

    // await result.save();

    // console.log("User Registered");

    // return res.send(`<script>
    //   alert("Profile Created Successfully");
    //   window.location.href="/";
    // </script>`);
  } catch (error) {
    console.log("Internal Server Error:", error);
    res.status(500).send("Error");
  }
});

app.get("/otppage", (req, res) => {
  res.render("otppage");
});

// ================= VERIFY OTP =================
app.post("/verifyotp", async (req, res) => {
  try {
    let userotp = "";

    // If inputs are separate like otp1 otp2 otp3 otp4
    if (Array.isArray(req.body.userotp)) {
      userotp = req.body.userotp.join("");
    } else {
      userotp = req.body.userotp;
    }

    let actualOTP = req.session.OTP;

    if (userotp == actualOTP) {
      const { username, useremail, password, phone } = req.session.userDetails;

      const hashpassword = await bcrypt.hash(password, 10);

      const result = new userSchema({
        username,
        useremail,
        password: hashpassword,
        phone,
      });

      await result.save();

      console.log("User Register");

      return res.send(
        `<script>
          alert('Congrats Happy to onboarding you..');
          window.location.href='/';
        </script>`,
      );
    } else {
      return res.send(
        `<script>
          alert('Wrong OTP, please enter valid OTP');
          window.location.assign('/otppage');
        </script>`,
      );
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
});

// ================= SERVER START =================
app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});
