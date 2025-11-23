require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();

// CORS
app.use(
  cors({
    origin: '*',
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
  })
);

// BODY PARSE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS,
  },
});

// FRONTEND HTML (UI)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SMTP Test</title>
        <style>
          body {
            background: #101010;
            font-family: Arial;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          form {
            background: #1b1b1b;
            padding: 25px;
            border-radius: 10px;
            width: 320px;
          }
          input, textarea {
            width: 100%;
            margin-top: 10px;
            padding: 10px;
            background: #2c2c2c;
            border: none;
            border-radius: 5px;
            color: white;
          }
          button {
            margin-top: 15px;
            width: 100%;
            padding: 10px;
            background: #4caf50;
            border: none;
            color: white;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
          }
        </style>
      </head>

      <body>
        <form id="form">
          <h2>SMTP Test Form</h2>
          <input type="email" id="email" placeholder="Email kiriting" required />
          <textarea id="message" placeholder="Xabar..." rows="4"></textarea>
          <button>Yuborish</button>
        </form>

        <script>
          document.getElementById("form").addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            const res = await fetch("/send", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, message }),
            });

            const data = await res.json();
            alert(data.message);
          });
        </script>
      </body>
    </html>
  `);
});

// BACKEND API
app.post('/send', async (req, res) => {
  console.log('REQ BODY:', req.body);

  const { email, message } = req.body;

  if (!email) return res.status(400).json({ message: 'email kerak' });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: 'Render SMTP Test',
      html: `<p>${message}</p>`,
    });

    return res.json({ message: 'Email yuborildi!' });
  } catch (err) {
    console.error('EMAIL ERROR:', err);
    return res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running at http://localhost:' + PORT));
