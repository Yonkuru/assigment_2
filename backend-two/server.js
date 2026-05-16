const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

const REG_NO = 'M02544_2023';

// GET /api/assignment2
// Returns info confirming this is Backend Service Two
app.get('/api/assignment2', (req, res) => {
  res.json({
    message: 'Assignment 2 is being served using a separate backend service from the one used in Assignment 1.',
    service: 'Backend Service Two',
    port: PORT,
    note: 'This backend (Backend Service Two) runs independently on port 5002. Backend Service One (port 5001) handles Assignment 1 Excel operations.'
  });
});

// POST /api/send-email
// Sends an email with the 4 required attachments to the provided address
app.post('/api/send-email', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email address is required' });
    }

    // Check that email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({
        error: 'Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.'
      });
    }

    // File paths for the attachments
    const rootDir = path.join(__dirname, '..');
    const excelFile = path.join(rootDir, `Assignment 1 Report - ${REG_NO}.xlsx`);
    const frontendReadme = path.join(rootDir, 'front-end', 'README.md');
    const backendOneReadme = path.join(rootDir, 'backend-one', 'README.md');
    const backendTwoReadme = path.join(rootDir, 'backend-two', 'README.md');

    // Verify all files exist
    const missingFiles = [excelFile, frontendReadme, backendOneReadme, backendTwoReadme].filter(
      f => !fs.existsSync(f)
    );
    if (missingFiles.length > 0) {
      return res.status(500).json({ error: 'Missing files: ' + missingFiles.join(', ') });
    }

    // Configure the email transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const emailBody = `
Hello,

My name is Blaise Yuo-B and my registration number is ${REG_NO}.

I am a student taking the course "Web Services and Service-Oriented Architecture".
I am passionate about software development and eager to apply what I learn in class to real-world projects.

Registration Number: ${REG_NO}

--- What I have learned in this course ---

In this course, I have learned the foundational concepts of web services and how modern applications communicate
over the internet. I now understand the difference between REST and SOAP web services, how APIs are designed,
and how frontend applications talk to backend services using HTTP methods such as GET, POST, PUT, and DELETE.
I also learned how JSON is used as the standard data format for exchanging information between systems.

I have also gained practical experience with Node.js and Express to build backend web services, using the
'xlsx' package to read and write Excel files programmatically, and using 'axios' for making HTTP requests
from the frontend. I now understand the concept of Service-Oriented Architecture (SOA) — where a system is
divided into independent, reusable services that communicate through well-defined APIs. This approach improves
scalability, maintainability, and separation of concerns in software development.

Best regards,
Blaise Yuo-B
${REG_NO}
    `.trim();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Assignment 1 & 2 Submitted Using My Own Web Service - ${REG_NO}`,
      text: emailBody,
      attachments: [
        {
          filename: `Assignment-1-Report--${REG_NO}.xlsx`,
          path: excelFile
        },
        {
          filename: `Assignment-2-FRONTEND-README--${REG_NO}.md`,
          path: frontendReadme
        },
        {
          filename: `Assignment-2-BACKEND-ONE-README--${REG_NO}.md`,
          path: backendOneReadme
        },
        {
          filename: `Assignment-2-BACKEND-TWO-README--${REG_NO}.md`,
          path: backendTwoReadme
        }
      ]
    });

    res.json({ success: true, message: `Email sent successfully to ${email}` });
  } catch (err) {
    console.error('Error sending email:', err.message);
    res.status(500).json({ error: 'Failed to send email: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Service Two running on http://localhost:${PORT}`);
});
