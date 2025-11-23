require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS
  }
});

// Frontend 
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SMTP Test</title>
        <style>
          body { background:#0f0f0f; color:white; font-family:Arial; display:flex; justify-content:center; align-items:center; height:100vh; }
          form { background:#1c1c1c; padding:25px; border-radius:10px; width:320px; }
          input, textarea { width:100%; margin-top:10px; padding:10px; border-radius:5px; border:none; outline:none; }
          button { margin-top:15px; width:100%; padding:10px; background:#4CAF50; color:white; border:none; border-radius:5px; cursor:pointer; }
        </style>
      </head>
      <body>
        <form id="form">
          <h3>SMTP Test Form</h3>
          <input type="email" id="email" placeholder="Email kiriting" required />
          <textarea id="message" placeholder="Xabar..." rows="4"></textarea>
          <button type="submit">Yuborish</button>
        </form>

        <script>
          const form = document.getElementById('form');
          form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const res = await fetch('/send', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, message })
            });

            const data = await res.json();
            alert(data.message || JSON.stringify(data));
          });
        </script>
      </body>
    </html>
  `);
});

// Backend - email yuborish API
app.post('/send', async (req, res) => {
  const { email, message } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email majburiy" });
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: "SMTP Test Xabari",
      html: `
        <h2>SMTP test</h2>
        <p>${message || "Bu test xabar."}</p>
      `
    });

    res.json({ message: "Xabar muvaffaqiyatli yuborildi!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Xatolik: " + err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port http://localhost:" + PORT));
