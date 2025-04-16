import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
// import fs from "fs";
// import path from "path";

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// POST route
app.post("/send-email", async (req, res) => {
  const { name, email, message, number } = req.body;

  if (!name || !email || !number) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    // Send to admin
    await transporter.sendMail({
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: `New message from ${name}`,
      text: `Hi Team, you have a new visitor. \n\n Details are: \n\n Name: ${name},\n\n Number:${number},\n\n Email: ${email}`,
    });

    // Send acknowledgment to user
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting us",
      text: `Hello ${name},\n\nThank you for reaching out! We will get back to you shortly.\n\nBest regards,\nEdusquare Team`,
    });

    res.status(200).json({ success: "Emails sent successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send emails." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
