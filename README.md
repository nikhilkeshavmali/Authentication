# 🔐 Authentication System with Email OTP Verification

A complete Authentication System built using **Node.js, Express, MongoDB, EJS, and Session-based Authentication** with **Email OTP Verification**.

---

## 🚀 Features

- ✅ User Signup
- ✅ Email OTP Verification
- ✅ Secure Password Hashing (bcrypt)
- ✅ Login Authentication
- ✅ Session-Based Authentication
- ✅ Protected Dashboard Route
- ✅ Logout Functionality
- ✅ MongoDB Database Integration

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- EJS
- bcryptjs
- express-session
- Nodemailer

---

## 📂 Project Structure

Authentication/
│
├── config/
│ └── db.js
│
├── model/
│ └── userSchema.js
│
├── views/
│ ├── login.ejs
│ ├── signup.ejs
│ ├── dashboard.ejs
│ └── otppage.ejs
│
├── public/
│
├── index.js
├── package.json
└── README.md

---

## 🔐 Authentication Flow

### 📝 Signup Process

1. User fills signup form
2. OTP generated (4-digit)
3. OTP sent to user's email
4. User verifies OTP
5. Password hashed using bcrypt
6. User saved to database

---

### 🔑 Login Process

1. User enters username & password
2. Password verified using bcrypt.compare()
3. Session created
4. Redirect to dashboard

---

### 🛡 Protected Route

Dashboard route checks:

```js
if (!req.session.loginId) {
   return res.redirect("/");
}
📧 Email OTP Setup

Make sure to configure your Gmail App Password in Nodemailer:

auth: {
   user: "your_email@gmail.com",
   pass: "your_app_password"
}

⚠ Do NOT push real credentials to GitHub. Use .env file.

⚙ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/nikhilkeshavmali/Authentication.git
2️⃣ Install Dependencies
npm install
3️⃣ Run Server
npx nodemon

Server will start at:

http://127.0.0.1:3000
🔒 Security Features
Password Hashing using bcrypt
Session Authentication
OTP Verification
Protected Routes
Secure Login Validation
🎯 Future Improvements
JWT Authentication
Forgot Password System
Email Verification Link (Token Based)
Rate Limiting
Production Deployment
👨‍💻 Author

Nikhil Mali
Full Stack Developer

GitHub: https://github.com/nikhilkeshavmali
```
