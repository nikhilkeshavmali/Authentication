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
    secret: "nikhilsecret", // Secret key to sign session ID
    resave: false, // Do not save session if not modified
    saveUninitialized: false, // Do not create session until something stored
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

    // 1️⃣ Check if user exists in database
    const isUserExists = await userSchema.findOne({ username });

    if (!isUserExists) {
      return res.send(
        `<script>alert('User not exists!'); window.location.assign('/')</script>`,
      );
    }

    // 2️⃣ Compare entered password with hashed password
    const isPasswordMatch = await bcrypt.compare(
      password,
      isUserExists.password,
    );

    if (!isPasswordMatch) {
      return res.send(
        `<script>alert('Invalid password!'); window.location.assign('/')</script>`,
      );
    }

    // 3️⃣ If both correct → create session
    req.session.loginId = isUserExists._id;

    console.log("Login Successfully");

    // Redirect to dashboard
    return res.redirect("/dashboard");
  } catch (err) {
    console.log("Internal Server Error", err);
    return res.status(500).send("Something went wrong");
  }
});

// ================= DASHBOARD =================
app.get("/dashboard", async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session.loginId) {
      return res.redirect("/");
    }

    // Find logged-in user data
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

    // Hash password before saving
    const hashpassword = await bcrypt.hash(password, 10);

    const result = new userSchema({
      username,
      useremail,
      password: hashpassword,
      phone,
    });

    await result.save();

    console.log("User Registered");

    return res.send(`<script>
      alert("Profile Created Successfully");
      window.location.href="/";
    </script>`);
  } catch (error) {
    console.log("Internal Server Error:", error);
    res.status(500).send("Error");
  }
});

// ================= SERVER START =================
app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});
