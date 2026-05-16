const express = require('express');
const cors = require('cors');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// Path to the Excel file (stored in the project root)
const EXCEL_FILE = path.join(__dirname, '..', 'Assignment 1 Report - M02544_2023.xlsx');

// GET /api/assignment1
// Returns all rows and merge info from the Excel file
app.get('/api/assignment1', (req, res) => {
  try {
    const wb = XLSX.readFile(EXCEL_FILE);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    const merges = ws['!merges'] || [];
    res.json({ data, merges });
  } catch (err) {
    console.error('Error reading Excel file:', err.message);
    res.status(500).json({ error: 'Failed to read Excel file: ' + err.message });
  }
});

// PUT /api/assignment1/:rowIndex
// Updates the Answer (column D, index 3) and Resource (column E, index 4) for a given row
app.put('/api/assignment1/:rowIndex', (req, res) => {
  try {
    const rowIndex = parseInt(req.params.rowIndex, 10);
    const { answer, resource } = req.body;

    if (isNaN(rowIndex) || rowIndex < 1) {
      return res.status(400).json({ error: 'Invalid row index' });
    }

    const wb = XLSX.readFile(EXCEL_FILE);
    const ws = wb.Sheets[wb.SheetNames[0]];

    // rowIndex is 0-based from the data array (row 0 = headers)
    // XLSX cell addresses are also 0-based
    const answerCellAddr = XLSX.utils.encode_cell({ r: rowIndex, c: 3 });
    const resourceCellAddr = XLSX.utils.encode_cell({ r: rowIndex, c: 4 });

    ws[answerCellAddr] = { t: 's', v: answer };
    ws[resourceCellAddr] = { t: 's', v: resource };

    XLSX.writeFile(wb, EXCEL_FILE);

    res.json({ success: true, message: 'Row updated successfully' });
  } catch (err) {
    console.error('Error writing Excel file:', err.message);
    res.status(500).json({ error: 'Failed to update Excel file: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Service One running on http://localhost:${PORT}`);
  console.log(`Excel file: ${EXCEL_FILE}`);
});
