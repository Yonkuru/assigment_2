import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const BACKEND_ONE = 'http://localhost:5001';

const s = {
  container: { maxWidth: '1300px', margin: '30px auto', padding: '0 20px' },
  card: {
    background: '#fff', borderRadius: '8px', padding: '24px',
    marginBottom: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  h2: { fontSize: '22px', marginBottom: '6px', color: '#1a73e8' },
  subtitle: { color: '#666', fontSize: '14px', marginBottom: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: {
    background: '#1a73e8', color: '#fff', padding: '10px 12px',
    textAlign: 'left', whiteSpace: 'nowrap', border: '1px solid #1557c0',
  },
  td: { border: '1px solid #ddd', padding: '8px 10px', verticalAlign: 'top' },
  tdCenter: { border: '1px solid #ddd', padding: '8px 10px', verticalAlign: 'top', textAlign: 'center', fontWeight: 'bold' },
  tdBold: { border: '1px solid #ddd', padding: '8px 10px', verticalAlign: 'top', fontWeight: 'bold' },
  tdAction: { border: '1px solid #ddd', padding: '8px 10px', textAlign: 'center', whiteSpace: 'nowrap' },
  textarea: {
    width: '100%', minHeight: '80px', padding: '6px',
    border: '1px solid #1a73e8', borderRadius: '4px',
    fontSize: '13px', fontFamily: 'Arial, sans-serif', resize: 'vertical',
  },
  btnEdit:   { padding: '4px 10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', margin: '2px' },
  btnSave:   { padding: '4px 10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', margin: '2px' },
  btnCancel: { padding: '4px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', margin: '2px' },
  alertSuccess: { padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', background: '#e6f4ea', color: '#1e7e34', border: '1px solid #a8d5b2', fontSize: '14px' },
  alertError:   { padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', background: '#fce8e6', color: '#b31412', border: '1px solid #f5c6c4', fontSize: '14px' },
};

export default function Assignment1() {
  const [tableData, setTableData] = useState([]);
  const [merges, setMerges] = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({ answer: '', resource: '' });
  const [status, setStatus] = useState(null); // { msg, type }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${BACKEND_ONE}/api/assignment1`)
      .then(res => {
        setTableData(res.data.data);
        setMerges(res.data.merges);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not connect to Backend Service One (port 3001). Make sure it is running.');
        setLoading(false);
      });
  }, []);

  // Build sets for quick lookup of merge info
  const mergeMap = {};
  const skipCells = new Set();
  merges.forEach(m => {
    const key = `${m.s.r},${m.s.c}`;
    mergeMap[key] = { rowspan: m.e.r - m.s.r + 1, colspan: m.e.c - m.s.c + 1 };
    for (let r = m.s.r; r <= m.e.r; r++) {
      for (let c = m.s.c; c <= m.e.c; c++) {
        if (r !== m.s.r || c !== m.s.c) skipCells.add(`${r},${c}`);
      }
    }
  });

  function startEdit(rowIndex, row) {
    setEditingRow(rowIndex);
    setEditValues({ answer: row[3] || '', resource: row[4] || '' });
  }

  function cancelEdit() {
    setEditingRow(null);
    setEditValues({ answer: '', resource: '' });
  }

  async function saveRow(rowIndex) {
    try {
      await axios.put(`${BACKEND_ONE}/api/assignment1/${rowIndex}`, {
        answer: editValues.answer,
        resource: editValues.resource,
      });
      // Update local state so the table reflects the change immediately
      setTableData(prev => {
        const updated = prev.map((row, i) => {
          if (i === rowIndex) {
            const newRow = [...row];
            newRow[3] = editValues.answer;
            newRow[4] = editValues.resource;
            return newRow;
          }
          return row;
        });
        return updated;
      });
      setEditingRow(null);
      setStatus({ msg: 'Row saved successfully to Excel file.', type: 'success' });
      setTimeout(() => setStatus(null), 4000);
    } catch (err) {
      setStatus({ msg: 'Error saving: ' + (err.response?.data?.error || err.message), type: 'error' });
      setTimeout(() => setStatus(null), 5000);
    }
  }

  // Column widths / styles
  function tdStyle(colIndex, isEven) {
    const base = { ...s.td, background: isEven ? '#f9f9f9' : '#fff' };
    if (colIndex === 0) return { ...base, textAlign: 'center', fontWeight: 'bold', width: '40px' };
    if (colIndex === 1) return { ...base, fontWeight: 'bold', width: '170px' };
    if (colIndex === 2) return { ...base, width: '220px' };
    return base;
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading data from Backend Service One...</div>;

  return (
    <div style={s.container}>
      <div style={s.card}>
        <h2 style={s.h2}>Assignment 1 - Web Services Report</h2>
        <p style={s.subtitle}>
          Data is read from the Excel file via <strong>Backend Service One</strong> (port 3001).
          Click <strong>Edit</strong> on any row to update the <em>Answer</em> and <em>Resources</em> columns.
        </p>

        {error && <div style={s.alertError}>{error}</div>}
        {status && <div style={status.type === 'success' ? s.alertSuccess : s.alertError}>{status.msg}</div>}

        <div style={{ overflowX: 'auto' }}>
          <table style={s.table}>
            <thead>
              <tr>
                {tableData[0]?.slice(0, 5).map((header, i) => (
                  <th key={i} style={s.th}>{header}</th>
                ))}
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.slice(1).map((row, idx) => {
                const r = idx + 1; // actual row index (data array is 0-based, row 0 = headers)
                const isEven = idx % 2 === 1;
                const isEditing = editingRow === r;

                return (
                  <tr key={r}>
                    {[0, 1, 2, 3, 4].map(c => {
                      if (skipCells.has(`${r},${c}`)) return null;
                      const merge = mergeMap[`${r},${c}`];
                      const rowspan = merge?.rowspan;
                      const colspan = merge?.colspan;

                      if (c === 3 || c === 4) {
                        // Editable columns
                        return (
                          <td key={c} rowSpan={rowspan} colSpan={colspan} style={tdStyle(c, isEven)}>
                            {isEditing ? (
                              <textarea
                                style={s.textarea}
                                value={c === 3 ? editValues.answer : editValues.resource}
                                onChange={e =>
                                  setEditValues(prev => ({
                                    ...prev,
                                    [c === 3 ? 'answer' : 'resource']: e.target.value,
                                  }))
                                }
                              />
                            ) : (
                              <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {row[c]}
                              </span>
                            )}
                          </td>
                        );
                      }

                      return (
                        <td key={c} rowSpan={rowspan} colSpan={colspan} style={tdStyle(c, isEven)}>
                          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {row[c]}
                          </span>
                        </td>
                      );
                    })}

                    <td style={{ ...s.tdAction, background: isEven ? '#f9f9f9' : '#fff' }}>
                      {isEditing ? (
                        <>
                          <button style={s.btnSave}   onClick={() => saveRow(r)}>Save</button>
                          <button style={s.btnCancel} onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <button style={s.btnEdit} onClick={() => startEdit(r, row)}>Edit</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
