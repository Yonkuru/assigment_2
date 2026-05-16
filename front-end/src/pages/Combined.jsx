import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_ONE = 'http://localhost:5001';
const BACKEND_TWO = 'http://localhost:5002';

const s = {
  container: { maxWidth: '1300px', margin: '30px auto', padding: '0 20px' },
  card: {
    background: '#fff', borderRadius: '8px', padding: '24px',
    marginBottom: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  h2: { fontSize: '22px', marginBottom: '10px', color: '#1a73e8', borderBottom: '2px solid #1a73e8', paddingBottom: '6px' },
  h3: { fontSize: '17px', marginBottom: '10px', color: '#333' },
  badge: {
    display: 'inline-block', fontSize: '11px', padding: '2px 9px',
    borderRadius: '10px', fontWeight: 'bold', marginBottom: '12px',
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '12px' },
  th: { background: '#1a73e8', color: '#fff', padding: '8px 10px', textAlign: 'left', border: '1px solid #1557c0' },
  td: { border: '1px solid #ddd', padding: '7px 9px', verticalAlign: 'top' },
  banner: {
    background: '#e8f0fe', border: '1px solid #c5d8ff',
    borderRadius: '6px', padding: '14px 18px', fontSize: '14px', lineHeight: '1.7',
  },
  divider: { border: 'none', borderTop: '2px solid #e0e0e0', margin: '24px 0' },
  emailSection: { marginTop: '24px' },
  inputRow: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '10px' },
  input: {
    flex: 1, minWidth: '260px', padding: '10px 14px',
    border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px',
  },
  btnSend: {
    padding: '10px 24px', background: '#1a73e8', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer',
    fontSize: '14px', fontWeight: 'bold',
  },
  btnSendDisabled: {
    padding: '10px 24px', background: '#aaa', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'not-allowed',
    fontSize: '14px', fontWeight: 'bold',
  },
  alertSuccess: { padding: '10px 14px', borderRadius: '4px', background: '#e6f4ea', color: '#1e7e34', border: '1px solid #a8d5b2', fontSize: '14px' },
  alertError:   { padding: '10px 14px', borderRadius: '4px', background: '#fce8e6', color: '#b31412', border: '1px solid #f5c6c4', fontSize: '14px' },
  attachmentList: { paddingLeft: '18px', marginTop: '8px' },
  attachmentItem: { fontSize: '13px', marginBottom: '4px', color: '#555', fontFamily: 'monospace' },
};

export default function Combined() {
  // Assignment 1 state
  const [tableData, setTableData] = useState([]);
  const [merges, setMerges]       = useState([]);
  const [a1Loading, setA1Loading] = useState(true);
  const [a1Error, setA1Error]     = useState('');

  // Assignment 2 state
  const [a2Data, setA2Data]     = useState(null);
  const [a2Error, setA2Error]   = useState('');

  // Email state
  const [email, setEmail]         = useState('');
  const [sending, setSending]     = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);

  useEffect(() => {
    axios.get(`${BACKEND_ONE}/api/assignment1`)
      .then(res => { setTableData(res.data.data); setMerges(res.data.merges); setA1Loading(false); })
      .catch(() => { setA1Error('Could not load from Backend Service One (port 3001).'); setA1Loading(false); });

    axios.get(`${BACKEND_TWO}/api/assignment2`)
      .then(res => setA2Data(res.data))
      .catch(() => setA2Error('Could not load from Backend Service Two (port 3002).'));
  }, []);

  // Build merge maps for the table
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

  async function sendEmail() {
    if (!email) return;
    setSending(true);
    setEmailStatus(null);
    try {
      const res = await axios.post(`${BACKEND_TWO}/api/send-email`, { email });
      setEmailStatus({ msg: res.data.message, type: 'success' });
    } catch (err) {
      setEmailStatus({ msg: err.response?.data?.error || err.message, type: 'error' });
    } finally {
      setSending(false);
    }
  }

  function tdStyle(c, isEven) {
    const base = { ...s.td, background: isEven ? '#f9f9f9' : '#fff' };
    if (c === 0) return { ...base, textAlign: 'center', fontWeight: 'bold', width: '36px' };
    if (c === 1) return { ...base, fontWeight: 'bold', width: '150px' };
    if (c === 2) return { ...base, width: '200px' };
    return base;
  }

  return (
    <div style={s.container}>

      {/* ── Assignment 1 ─────────────────────────────────── */}
      <div style={s.card}>
        <h2 style={s.h2}>Assignment 1</h2>
        <span style={{ ...s.badge, background: '#e8f0fe', color: '#1a73e8', border: '1px solid #c5d8ff' }}>
          Backend Service One — port 5001
        </span>

        {a1Error && <div style={s.alertError}>{a1Error}</div>}
        {a1Loading && <p style={{ color: '#888' }}>Loading...</p>}

        {!a1Loading && !a1Error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={s.table}>
              <thead>
                <tr>
                  {tableData[0]?.slice(0, 5).map((h, i) => <th key={i} style={s.th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {tableData.slice(1).map((row, idx) => {
                  const r = idx + 1;
                  const isEven = idx % 2 === 1;
                  return (
                    <tr key={r}>
                      {[0, 1, 2, 3, 4].map(c => {
                        if (skipCells.has(`${r},${c}`)) return null;
                        const merge = mergeMap[`${r},${c}`];
                        return (
                          <td key={c} rowSpan={merge?.rowspan} colSpan={merge?.colspan} style={tdStyle(c, isEven)}>
                            <span style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{row[c]}</span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Assignment 2 ─────────────────────────────────── */}
      <div style={s.card}>
        <h2 style={s.h2}>Assignment 2</h2>
        <span style={{ ...s.badge, background: '#e6f4ea', color: '#1e7e34', border: '1px solid #a8d5b2' }}>
          Backend Service Two — port 5002
        </span>

        {a2Error && <div style={s.alertError}>{a2Error}</div>}

        {a2Data && (
          <div style={s.banner}>
            <strong>Confirmed:</strong> {a2Data.message}
            <br />
            <strong>Service:</strong> {a2Data.service} &nbsp;|&nbsp; <strong>Port:</strong> {a2Data.port}
          </div>
        )}
      </div>

      {/* ── Email Section ─────────────────────────────────── */}
      <div style={s.card}>
        <h2 style={s.h2}>Send Assignments by Email</h2>
        <p style={{ fontSize: '14px', color: '#555', marginBottom: '16px' }}>
          Enter an email address below and click <strong>Send</strong>. The system will send an email
          with the following 4 files attached:
        </p>
        <ul style={s.attachmentList}>
          <li style={s.attachmentItem}>Assignment-1-Report--M02544_2023.xlsx</li>
          <li style={s.attachmentItem}>Assignment-2-FRONTEND-README--M02544_2023.md</li>
          <li style={s.attachmentItem}>Assignment-2-BACKEND-ONE-README--M02544_2023.md</li>
          <li style={s.attachmentItem}>Assignment-2-BACKEND-TWO-README--M02544_2023.md</li>
        </ul>

        <div style={{ ...s.emailSection }}>
          <div style={s.inputRow}>
            <input
              type="email"
              placeholder="Enter email address..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={s.input}
              onKeyDown={e => e.key === 'Enter' && !sending && sendEmail()}
            />
            <button
              style={sending ? s.btnSendDisabled : s.btnSend}
              onClick={sendEmail}
              disabled={sending}
            >
              {sending ? 'Sending...' : 'Send Email'}
            </button>
          </div>

          {emailStatus && (
            <div style={emailStatus.type === 'success' ? s.alertSuccess : s.alertError}>
              {emailStatus.msg}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
