require('dotenv').config()
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

// Static UI
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // o'zingiz kiritasiz
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER, // email
    pass: process.env.SMTP_PASS, // parol
  },
});

app.post('/send', async (req, res) => {
  try {
    const { email, subject, message } = req.body;

    const mailOptions = {
      from: 'info@yourdomain.com',
      to: email,
      subject,
      html: `<p>${message}</p>`,
    };

    // Hostinglarda serverlessga o'xshash boshqaruv bo'lgani uchun
    // transporterni Promise ga o'raymiz (siz aytgan usul)
    await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) reject(err);
        else resolve(info);
      });
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Xatolik:', err);
    res.json({ ok: false, msg: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
