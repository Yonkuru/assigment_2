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
  tdAction: { border: '1px solid #ddd', padding: '8px 10px', textAlign: 'center', whiteSpace: 'nowrap' },
  textarea: {
    width: '100%', minHeight: '80px', padding: '6px',
    border: '1px solid #1a73e8', borderRadius: '4px',
    fontSize: '13px', fontFamily: 'Arial, sans-serif', resize: 'vertical',
  },
  btnEdit:   { padding: '4px 10px', background: '#1a73e8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', margin: '2px' },
  btnSave:   { padding: '4px 10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', margin: '2px' },
  btnCancel: { padding: '4px 10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', margin: '2px' },
  btnDelete: { padding: '4px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', margin: '2px' },
  btnAdd:    { padding: '8px 16px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  alertSuccess: { padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', background: '#e6f4ea', color: '#1e7e34', border: '1px solid #a8d5b2', fontSize: '14px' },
  alertError:   { padding: '10px 14px', borderRadius: '4px', marginBottom: '16px', background: '#fce8e6', color: '#b31412', border: '1px solid #f5c6c4', fontSize: '14px' },
  // Modal styles
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.45)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    background: '#fff', borderRadius: '8px', padding: '28px',
    width: '100%', maxWidth: '540px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
  },
  modalTitle: { fontSize: '18px', fontWeight: 'bold', color: '#1a73e8', marginBottom: '20px' },
  formRow: { marginBottom: '14px' },
  label: { display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '4px' },
  input: {
    width: '100%', padding: '8px 10px', border: '1px solid #ccc',
    borderRadius: '4px', fontSize: '13px',
  },
  formTextarea: {
    width: '100%', padding: '8px 10px', border: '1px solid #ccc',
    borderRadius: '4px', fontSize: '13px', minHeight: '80px',
    fontFamily: 'Arial, sans-serif', resize: 'vertical',
  },
  modalActions: { display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' },
  btnModalSave:   { padding: '8px 20px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
  btnModalCancel: { padding: '8px 20px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' },
};

const EMPTY_ITEM = { no: '', title: '', subtitle: '', answer: '', resource: '' };

export default function Assignment1() {
  const [tableData, setTableData]   = useState([]);
  const [merges, setMerges]         = useState([]);
  const [editingRow, setEditingRow] = useState(null);
  const [editValues, setEditValues] = useState({ answer: '', resource: '' });
  const [status, setStatus]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [showModal, setShowModal]   = useState(false);
  const [newItem, setNewItem]       = useState(EMPTY_ITEM);
  const [saving, setSaving]         = useState(false);

  function loadData() {
    return axios.get(`${BACKEND_ONE}/api/assignment1`)
      .then(res => {
        setTableData(res.data.data);
        setMerges(res.data.merges);
      });
  }

  useEffect(() => {
    loadData()
      .catch(() => setError('Could not connect to Backend Service One (port 5001). Make sure it is running.'))
      .finally(() => setLoading(false));
  }, []);

  function showStatus(msg, type, duration = 4000) {
    setStatus({ msg, type });
    setTimeout(() => setStatus(null), duration);
  }

  // Build merge maps
  const mergeMap = {};
  const skipCells = new Set();
  merges.forEach(m => {
    mergeMap[`${m.s.r},${m.s.c}`] = { rowspan: m.e.r - m.s.r + 1, colspan: m.e.c - m.s.c + 1 };
    for (let r = m.s.r; r <= m.e.r; r++) {
      for (let c = m.s.c; c <= m.e.c; c++) {
        if (r !== m.s.r || c !== m.s.c) skipCells.add(`${r},${c}`);
      }
    }
  });

  // ── Edit ──────────────────────────────────────────────
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
      setTableData(prev => prev.map((row, i) => {
        if (i !== rowIndex) return row;
        const updated = [...row];
        updated[3] = editValues.answer;
        updated[4] = editValues.resource;
        return updated;
      }));
      setEditingRow(null);
      showStatus('Row saved successfully to Excel file.', 'success');
    } catch (err) {
      showStatus('Error saving: ' + (err.response?.data?.error || err.message), 'error');
    }
  }

  // ── Delete ────────────────────────────────────────────
  async function deleteRow(rowIndex) {
    if (!window.confirm('Are you sure you want to delete this row? This cannot be undone.')) return;
    try {
      await axios.delete(`${BACKEND_ONE}/api/assignment1/${rowIndex}`);
      // Reload from server so merges stay in sync
      await loadData();
      showStatus('Row deleted successfully.', 'success');
    } catch (err) {
      showStatus('Error deleting: ' + (err.response?.data?.error || err.message), 'error');
    }
  }

  // ── Add Item ──────────────────────────────────────────
  function openModal() {
    setNewItem(EMPTY_ITEM);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setNewItem(EMPTY_ITEM);
  }

  async function submitNewItem() {
    if (!newItem.subtitle.trim()) {
      showStatus('Subtitle is required.', 'error');
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${BACKEND_ONE}/api/assignment1`, newItem);
      await loadData();
      closeModal();
      showStatus('New row added to Excel file.', 'success');
    } catch (err) {
      showStatus('Error adding row: ' + (err.response?.data?.error || err.message), 'error');
    } finally {
      setSaving(false);
    }
  }

  // ── Column style helper ───────────────────────────────
  function tdStyle(c, isEven) {
    const base = { ...s.td, background: isEven ? '#f9f9f9' : '#fff' };
    if (c === 0) return { ...base, textAlign: 'center', fontWeight: 'bold', width: '40px' };
    if (c === 1) return { ...base, fontWeight: 'bold', width: '170px' };
    if (c === 2) return { ...base, width: '220px' };
    return base;
  }

  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>Loading data from Backend Service One...</div>;

  return (
    <div style={s.container}>
      <div style={s.card}>

        {/* ── Header row ──────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
          <h2 style={{ ...s.h2, marginBottom: 0 }}>Assignment 1 - Web Services Report</h2>
          <button style={s.btnAdd} onClick={openModal}>+ Add Item</button>
        </div>
        <p style={s.subtitle}>
          Data is read from the Excel file via <strong>Backend Service One</strong> (port 5001).
          Click <strong>Edit</strong> to update Answer &amp; Resources, or <strong>Delete</strong> to remove a row.
        </p>

        {error  && <div style={s.alertError}>{error}</div>}
        {status && <div style={status.type === 'success' ? s.alertSuccess : s.alertError}>{status.msg}</div>}

        {/* ── Table ───────────────────────────────── */}
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
                const r = idx + 1;
                const isEven = idx % 2 === 1;
                const isEditing = editingRow === r;

                return (
                  <tr key={r}>
                    {[0, 1, 2, 3, 4].map(c => {
                      if (skipCells.has(`${r},${c}`)) return null;
                      const merge = mergeMap[`${r},${c}`];

                      if (c === 3 || c === 4) {
                        return (
                          <td key={c} rowSpan={merge?.rowspan} colSpan={merge?.colspan} style={tdStyle(c, isEven)}>
                            {isEditing ? (
                              <textarea
                                style={s.textarea}
                                value={c === 3 ? editValues.answer : editValues.resource}
                                onChange={e => setEditValues(prev => ({
                                  ...prev,
                                  [c === 3 ? 'answer' : 'resource']: e.target.value,
                                }))}
                              />
                            ) : (
                              <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{row[c]}</span>
                            )}
                          </td>
                        );
                      }

                      return (
                        <td key={c} rowSpan={merge?.rowspan} colSpan={merge?.colspan} style={tdStyle(c, isEven)}>
                          <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{row[c]}</span>
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
                        <>
                          <button style={s.btnEdit}   onClick={() => startEdit(r, row)}>Edit</button>
                          <button style={s.btnDelete} onClick={() => deleteRow(r)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Add Item Modal ───────────────────────────────── */}
      {showModal && (
        <div style={s.overlay} onClick={e => e.target === e.currentTarget && closeModal()}>
          <div style={s.modal}>
            <div style={s.modalTitle}>Add New Item</div>

            <div style={s.formRow}>
              <label style={s.label}>No</label>
              <input style={s.input} type="text" placeholder="e.g. 6"
                value={newItem.no} onChange={e => setNewItem(p => ({ ...p, no: e.target.value }))} />
            </div>

            <div style={s.formRow}>
              <label style={s.label}>Title</label>
              <input style={s.input} type="text" placeholder="e.g. API Design"
                value={newItem.title} onChange={e => setNewItem(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div style={s.formRow}>
              <label style={s.label}>Subtitle <span style={{ color: '#dc3545' }}>*</span></label>
              <input style={s.input} type="text" placeholder="Sub-question or topic description"
                value={newItem.subtitle} onChange={e => setNewItem(p => ({ ...p, subtitle: e.target.value }))} />
            </div>

            <div style={s.formRow}>
              <label style={s.label}>Answer</label>
              <textarea style={s.formTextarea} placeholder="Your answer..."
                value={newItem.answer} onChange={e => setNewItem(p => ({ ...p, answer: e.target.value }))} />
            </div>

            <div style={s.formRow}>
              <label style={s.label}>Resource</label>
              <input style={s.input} type="text" placeholder="https://..."
                value={newItem.resource} onChange={e => setNewItem(p => ({ ...p, resource: e.target.value }))} />
            </div>

            <div style={s.modalActions}>
              <button style={s.btnModalCancel} onClick={closeModal}>Cancel</button>
              <button style={s.btnModalSave} onClick={submitNewItem} disabled={saving}>
                {saving ? 'Adding...' : 'Add Item'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
