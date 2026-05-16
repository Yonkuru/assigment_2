# Backend Service One - README

**Student:** Blaise Yuo-B
**Registration Number:** M02544_2023
**Course:** Web Services and Service-Oriented Architecture

---

## Overview

This is **Backend Service One**. It is a Node.js web service built with **Express.js** that runs on port **3001**. Its responsibility is to read and write data from the Assignment 1 Excel file (`Assignment 1 Report - M02544_2023.xlsx`). It exposes a REST API that the frontend React app consumes.

---

## Step-by-Step Development

### Step 1: Project Setup

I created the `backend-one/` directory and initialized a Node.js project:

```bash
cd backend-one
npm install
```

The `package.json` includes:
- `express` — to create the web server and define API routes
- `cors` — to allow the frontend (port 3000) to make requests to this service (port 3001)
- `xlsx` — to read and write `.xlsx` Excel files

### Step 2: Understanding the Excel File

The Excel file (`Assignment 1 Report - M02544_2023.xlsx`) contains:
- **Column A (No):** Topic number (1–5), merged across 2 rows per topic
- **Column B (Title):** Topic name, merged across 2 rows per topic
- **Column C (Subtitle):** Sub-question for each row
- **Column D (Answer):** The answer — editable
- **Column E (Resource):** Reference links — editable

The file has 11 rows (1 header + 10 data rows = 5 topics × 2 subtopics each).

### Step 3: Reading the Excel File

I used the `xlsx` package to read the file:

```js
const wb = XLSX.readFile(EXCEL_FILE);
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
const merges = ws['!merges'] || [];
```

- `sheet_to_json` with `header: 1` returns a 2D array where `data[0]` is the header row
- `ws['!merges']` returns the list of merged cell regions, which the frontend uses to render `rowSpan`/`colSpan` in the HTML table

### Step 4: GET /api/assignment1

This endpoint returns all the table data and merge information to the frontend:

```js
app.get('/api/assignment1', (req, res) => {
  const wb = XLSX.readFile(EXCEL_FILE);
  const ws = wb.Sheets[wb.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
  const merges = ws['!merges'] || [];
  res.json({ data, merges });
});
```

### Step 5: PUT /api/assignment1/:rowIndex

This endpoint receives a `rowIndex` (0-based, matching the data array position) and the new `answer` and `resource` values, then writes them back to the Excel file:

```js
app.put('/api/assignment1/:rowIndex', (req, res) => {
  const rowIndex = parseInt(req.params.rowIndex, 10);
  const { answer, resource } = req.body;
  const wb = XLSX.readFile(EXCEL_FILE);
  const ws = wb.Sheets[wb.SheetNames[0]];
  ws[XLSX.utils.encode_cell({ r: rowIndex, c: 3 })] = { t: 's', v: answer };
  ws[XLSX.utils.encode_cell({ r: rowIndex, c: 4 })] = { t: 's', v: resource };
  XLSX.writeFile(wb, EXCEL_FILE);
  res.json({ success: true });
});
```

### Step 6: CORS Configuration

I added `cors()` middleware so the React frontend (different port) can make requests to this API without being blocked by the browser's same-origin policy.

### Step 7: Starting the Server

```js
app.listen(3001, () => {
  console.log('Backend Service One running on http://localhost:3001');
});
```

---

## API Endpoints

| Method | Route                          | Description                              |
|--------|--------------------------------|------------------------------------------|
| GET    | `/api/assignment1`             | Returns all Excel rows and merge info    |
| PUT    | `/api/assignment1/:rowIndex`   | Updates Answer and Resource for a row    |

---

## How to Run

```bash
cd backend-one
npm install
npm start
```

The service will be available at: **http://localhost:3001**
