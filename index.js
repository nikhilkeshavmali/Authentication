const express = require("express");

const app = express();

const PORT = 3000;
const HOST = "127.0.0.1";

const bcrypt = require("bcryptjs");

// middleware
app.use(express.static("public/"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");

//db config
const connection = require("./config/db");

//model
const userSchema = require("./model/userSchema");

app.get("/", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check user exists
    const user = await userSchema.findOne({ username });

    if (!user) {
      return res.send(
        `<script>alert('User Not Found'); window.location.href='/'</script>`,
      );
    }

    // 2. Compare password
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.send(
        `<script>alert('Invalid Password'); window.location.href='/'</script>`,
      );
    }

    // 3. Success
    console.log("Login Successfully...");

    // return res.send("<h1>Dashboard Page</h1>");
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
  try {
    const { username, useremail, password, phone } = req.body;

    if (!username || !useremail || !password || !phone) {
      return res.send(`aleart('All fields Are Required')
            window.location.href='/signup'
            `);
    }

    //hashed password - Asynchronously generates a hash for the given password.
    const hashpassword = await bcrypt.hash(password, 10);
    // res.send(hashpassword)

    const result = new userSchema({
      username,
      useremail,
      password: hashpassword,
      phone,
    });

    await result.save();

    console.log("User Registered");

    return res.send(`<script>
        alert("Profile Created..")
        window.location.href="/"
      </script>`);
  } catch (error) {
    console.log("Internal Server Error:", error);
    res.status(500).send("Error");
  }
});

app.listen(PORT, HOST, () => {
  console.log(`http://${HOST}:${PORT}`);
});
