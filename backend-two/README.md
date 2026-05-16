# Backend Service Two - README

**Student:** Blaise Yuo-B
**Registration Number:** M02544_2023
**Course:** Web Services and Service-Oriented Architecture

---

## Overview

This is **Backend Service Two**. It is a Node.js web service built with **Express.js** that runs on port **3002**. It serves two purposes:

1. Provides the Assignment 2 information (confirming it is a separate service from Backend One)
2. Handles the email-sending functionality — picks up files from their directories, renames them, and sends them as email attachments to a given email address

---

## Step-by-Step Development

### Step 1: Project Setup

I created the `backend-two/` directory and initialized a Node.js project:

```bash
cd backend-two
npm install
```

The `package.json` includes:
- `express` — to create the web server and define API routes
- `cors` — to allow the React frontend (port 3000) to call this service
- `nodemailer` — to send emails with attachments (I researched this package as required by the assignment)

### Step 2: Researching Nodemailer

The assignment required me to find a package for sending emails on my own. After research, I found `nodemailer`, which is the most widely used Node.js library for sending emails. It supports:
- Gmail, SMTP, and other email providers
- HTML and plain-text email bodies
- File attachments (with the ability to rename files)

To use Gmail with Nodemailer, I needed to:
1. Enable 2-Factor Authentication on the Gmail account
2. Generate an **App Password** (Google Account → Security → App Passwords)
3. Use that App Password instead of the regular Gmail password

### Step 3: Environment Variables

Email credentials must NOT be hardcoded in source code. I used environment variables:

- `EMAIL_USER` — Gmail address (e.g. `myemail@gmail.com`)
- `EMAIL_PASS` — Gmail App Password

These are set in the terminal before running the server:
```bash
EMAIL_USER=myemail@gmail.com EMAIL_PASS=xxxx npm start
```

### Step 4: GET /api/assignment2

This endpoint confirms that Assignment 2 is served by this separate backend service:

```js
app.get('/api/assignment2', (req, res) => {
  res.json({
    message: 'Assignment 2 is being served using a separate backend service from the one used in Assignment 1.',
    service: 'Backend Service Two',
    port: 3002,
    note: 'This backend runs independently on port 3002. Backend Service One (port 3001) handles Assignment 1.'
  });
});
```

### Step 5: POST /api/send-email

This is the main feature of Backend Two. When the frontend calls this endpoint with an email address:

1. **Validate** the email address
2. **Check** that `EMAIL_USER` and `EMAIL_PASS` are set
3. **Locate the files** from their directories using `path.join`:
   - `../Assignment 1 Report - M02544_2023.xlsx`
   - `../front-end/README.md`
   - `../backend-one/README.md`
   - `../backend-two/README.md`
4. **Verify** all files exist using `fs.existsSync`
5. **Create a Nodemailer transporter** with Gmail credentials
6. **Send the email** with:
   - Subject: `Assignment 1 & 2 Submitted Using My Own Web Service - M02544_2023`
   - Body: introduction, registration number, description, and what was learned
   - Attachments: the 4 files, programmatically renamed

```js
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: email,
  subject: `Assignment 1 & 2 Submitted Using My Own Web Service - ${REG_NO}`,
  text: emailBody,
  attachments: [
    { filename: `Assignment-1-Report--${REG_NO}.xlsx`,              path: excelFile },
    { filename: `Assignment-2-FRONTEND-README--${REG_NO}.md`,       path: frontendReadme },
    { filename: `Assignment-2-BACKEND-ONE-README--${REG_NO}.md`,    path: backendOneReadme },
    { filename: `Assignment-2-BACKEND-TWO-README--${REG_NO}.md`,    path: backendTwoReadme },
  ]
});
```

The `filename` property in each attachment is how the file will appear in the email — it is different from the actual file name on disk. This is the programmatic renaming required by the assignment.

### Step 6: CORS Configuration

I added `cors()` middleware so the React frontend can POST to this service from a different port.

---

## API Endpoints

| Method | Route               | Description                                              |
|--------|---------------------|----------------------------------------------------------|
| GET    | `/api/assignment2`  | Returns Assignment 2 confirmation message                |
| POST   | `/api/send-email`   | Sends email with 4 renamed attachments to given address  |

**POST `/api/send-email` body:**
```json
{ "email": "recipient@example.com" }
```

---

## How to Run

```bash
cd backend-two
npm install
EMAIL_USER=your-email@gmail.com EMAIL_PASS=your-app-password npm start
```

The service will be available at: **http://localhost:3002**

> **Important:** You must set up a Gmail App Password. Go to your Google Account → Security → 2-Step Verification → App Passwords, generate one, and use it as `EMAIL_PASS`.
