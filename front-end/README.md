# Frontend - README

**Student:** Blaise Yuo-B
**Registration Number:** M02544_2023
**Course:** Web Services and Service-Oriented Architecture

---

## Overview

This is the **Frontend** service of the Assignment 2 project. It is built using **React.js** and served through **Vite** on port **3000**. It communicates with two separate backend services via HTTP (using `axios`).

---

## Step-by-Step Development

### Step 1: Project Setup

I initialized a new React project using Vite:

```bash
cd front-end
npm install
```

The `package.json` includes:
- `react` and `react-dom` for building the UI
- `react-router-dom` for client-side routing between pages
- `axios` for making HTTP requests to the backend services
- `vite` and `@vitejs/plugin-react` as dev tools

### Step 2: Configuring Vite

I created `vite.config.js` to configure the dev server to run on port 3000:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
});
```

### Step 3: Entry Point

`index.html` is the single HTML file that Vite serves. It includes a `<div id="root">` where React mounts the app.

`src/main.jsx` renders the root `<App />` component into that `div`.

### Step 4: Routing with React Router

`src/App.jsx` sets up client-side routing using `BrowserRouter` and `Routes` from `react-router-dom`. Four routes are defined:

| Route          | Component       | Description                          |
|----------------|-----------------|--------------------------------------|
| `/`            | `Home`          | Home page with student info          |
| `/assignment1` | `Assignment1`   | Excel table from Backend One         |
| `/assignment2` | `Assignment2`   | Assignment 2 info from Backend Two   |
| `/combined`    | `Combined`      | Both assignments + email sender      |

### Step 5: Navbar Component

`src/components/Navbar.jsx` renders navigation links using `NavLink` from React Router. The active link is visually underlined.

### Step 6: Home Page

`src/pages/Home.jsx` displays:
- Full name and registration number
- Course sentence
- Two paragraphs about what was learned
- Clickable links to Assignment 1 and Assignment 2 pages

### Step 7: Assignment 1 Page

`src/pages/Assignment1.jsx`:
1. On mount (`useEffect`), fetches Excel data from **Backend One** at `GET http://localhost:3001/api/assignment1`
2. Receives `data` (2D array of rows) and `merges` (array of merge definitions)
3. Builds a `mergeMap` and `skipCells` set to correctly render merged cells with `rowSpan` and `colSpan`
4. Renders an HTML table with all 5 columns
5. Columns 3 (Answer) and 4 (Resource) are editable — clicking **Edit** shows a `<textarea>`
6. Clicking **Save** sends `PUT http://localhost:3001/api/assignment1/:rowIndex` with the new values
7. On success, local state is updated immediately and the Excel file is updated on the server

### Step 8: Assignment 2 Page

`src/pages/Assignment2.jsx`:
1. Fetches data from **Backend Two** at `GET http://localhost:3002/api/assignment2`
2. Displays the confirmation message that this page is served by Backend Service Two
3. Shows the system architecture (Frontend ↔ Backend One ↔ Backend Two)

### Step 9: Combined Page

`src/pages/Combined.jsx`:
1. Fetches Assignment 1 data from Backend One and renders the table (read-only)
2. Fetches Assignment 2 info from Backend Two and displays the message
3. Shows an email input form
4. On submit, sends `POST http://localhost:3002/api/send-email` with the email address
5. Backend Two handles picking up the files, renaming them, and sending the email

---

## How to Run

```bash
cd front-end
npm install
npm run dev
```

Open your browser at: **http://localhost:3000**

> Make sure Backend Service One (port 3001) and Backend Service Two (port 3002) are also running.
