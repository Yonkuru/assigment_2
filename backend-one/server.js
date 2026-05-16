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

// DELETE /api/assignment1/:rowIndex
// Removes a row from the Excel sheet and adjusts merge regions accordingly
app.delete('/api/assignment1/:rowIndex', (req, res) => {
  try {
    const rowIndex = parseInt(req.params.rowIndex, 10);
    if (isNaN(rowIndex) || rowIndex < 1) {
      return res.status(400).json({ error: 'Invalid row index' });
    }

    const wb = XLSX.readFile(EXCEL_FILE);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    const oldMerges = ws['!merges'] || [];

    // Remove the row from the data array
    data.splice(rowIndex, 1);

    // Rebuild the worksheet from the modified data
    const newWs = XLSX.utils.aoa_to_sheet(data);

    // Adjust merge regions:
    // - Merges that contain the deleted row are shrunk or removed
    // - Merges entirely below the deleted row are shifted up by 1
    const newMerges = [];
    oldMerges.forEach(m => {
      if (rowIndex >= m.s.r && rowIndex <= m.e.r) {
        // Deleted row is inside this merge
        if (m.e.r - m.s.r > 1) {
          // Merge spans more than 2 rows — shrink it by 1
          newMerges.push({ s: m.s, e: { r: m.e.r - 1, c: m.e.c } });
        }
        // 2-row merge loses 1 row → no longer needs a merge, skip it
      } else if (m.s.r > rowIndex) {
        // Merge is entirely below the deleted row — shift up by 1
        newMerges.push({
          s: { r: m.s.r - 1, c: m.s.c },
          e: { r: m.e.r - 1, c: m.e.c }
        });
      } else {
        // Merge is entirely above the deleted row — keep as is
        newMerges.push(m);
      }
    });

    newWs['!merges'] = newMerges;
    wb.Sheets[wb.SheetNames[0]] = newWs;
    XLSX.writeFile(wb, EXCEL_FILE);

    res.json({ success: true, message: 'Row deleted successfully' });
  } catch (err) {
    console.error('Error deleting row:', err.message);
    res.status(500).json({ error: 'Failed to delete row: ' + err.message });
  }
});

// POST /api/assignment1
// Appends a new row at the end of the Excel sheet
app.post('/api/assignment1', (req, res) => {
  try {
    const { no, title, subtitle, answer, resource } = req.body;

    const wb = XLSX.readFile(EXCEL_FILE);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
    const existingMerges = ws['!merges'] || [];

    // Append the new row (6 columns to match the original sheet layout)
    data.push([no || '', title || '', subtitle || '', answer || '', resource || '', '']);

    // Rebuild the worksheet and preserve existing merge regions
    const newWs = XLSX.utils.aoa_to_sheet(data);
    newWs['!merges'] = existingMerges;
    wb.Sheets[wb.SheetNames[0]] = newWs;
    XLSX.writeFile(wb, EXCEL_FILE);

    res.json({ success: true, message: 'Row added successfully' });
  } catch (err) {
    console.error('Error adding row:', err.message);
    res.status(500).json({ error: 'Failed to add row: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend Service One running on http://localhost:${PORT}`);
  console.log(`Excel file: ${EXCEL_FILE}`);
});
