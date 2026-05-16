import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BACKEND_TWO = 'http://localhost:5002';

const s = {
  container: { maxWidth: '860px', margin: '40px auto', padding: '0 20px' },
  card: {
    background: '#fff', borderRadius: '8px', padding: '30px',
    marginBottom: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  h2: { fontSize: '22px', marginBottom: '12px', color: '#1a73e8', borderBottom: '2px solid #1a73e8', paddingBottom: '6px' },
  badge: {
    display: 'inline-block', background: '#28a745', color: '#fff',
    fontSize: '12px', padding: '3px 10px', borderRadius: '12px',
    fontWeight: 'bold', marginBottom: '16px',
  },
  banner: {
    background: '#e8f0fe', border: '1px solid #c5d8ff',
    borderRadius: '6px', padding: '16px 20px',
    marginBottom: '20px', fontSize: '15px', lineHeight: '1.7',
  },
  errorBanner: {
    background: '#fce8e6', border: '1px solid #f5c6c4',
    borderRadius: '6px', padding: '16px 20px',
    marginBottom: '20px', fontSize: '15px', color: '#b31412',
  },
  architecture: { display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px', alignItems: 'center' },
  serviceBox: {
    flex: 1, minWidth: '190px', border: '2px solid #1a73e8',
    borderRadius: '8px', padding: '16px', textAlign: 'center',
  },
  serviceBoxActive: {
    flex: 1, minWidth: '190px', border: '2px solid #1a73e8',
    borderRadius: '8px', padding: '16px', textAlign: 'center',
    background: '#1a73e8', color: '#fff',
  },
  arrow: { fontSize: '24px', color: '#1a73e8', flexShrink: 0 },
  pre: {
    background: '#f8f9fa', border: '1px solid #e0e0e0', borderRadius: '6px',
    padding: '14px', fontSize: '13px', fontFamily: 'monospace',
    whiteSpace: 'pre-wrap', marginTop: '16px',
  },
};

export default function Assignment2() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${BACKEND_TWO}/api/assignment2`)
      .then(res => setData(res.data))
      .catch(() => setError('Could not connect to Backend Service Two (port 3002). Make sure it is running.'));
  }, []);

  return (
    <div style={s.container}>

      <div style={s.card}>
        <h2 style={s.h2}>Assignment 2</h2>
        <span style={s.badge}>Served by Backend Service Two (port 5002)</span>

        {error && <div style={s.errorBanner}>{error}</div>}

        {data ? (
          <>
            <div style={s.banner}>
              <strong>Confirmed:</strong> {data.message}
              <br /><br />
              <strong>Service:</strong> {data.service} &nbsp;|&nbsp; <strong>Port:</strong> {data.port}
              <br />
              <em style={{ color: '#555' }}>{data.note}</em>
            </div>
            <pre style={s.pre}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </>
        ) : !error ? (
          <p style={{ color: '#888' }}>Fetching data from Backend Service Two...</p>
        ) : null}
      </div>

      <div style={s.card}>
        <h2 style={s.h2}>System Architecture</h2>
        <p style={{ fontSize: '14px', marginBottom: '16px', color: '#555' }}>
          This project uses three separate services that communicate with each other:
        </p>
        <div style={s.architecture}>
          <div style={s.serviceBox}>
            <h3 style={{ fontSize: '14px', marginBottom: '6px' }}>Frontend (React)</h3>
            <p style={{ fontSize: '12px', opacity: 0.75 }}>Port 3000</p>
            <p style={{ fontSize: '12px', opacity: 0.75 }}>Serves React pages via Vite</p>
          </div>
          <div style={s.arrow}>&#8660;</div>
          <div style={s.serviceBox}>
            <h3 style={{ fontSize: '14px', marginBottom: '6px' }}>Backend Service One</h3>
            <p style={{ fontSize: '12px', opacity: 0.75 }}>Port 5001</p>
            <p style={{ fontSize: '12px', opacity: 0.75 }}>Reads &amp; writes Excel for Assignment 1</p>
          </div>
          <div style={s.arrow}>&#8660;</div>
          <div style={s.serviceBoxActive}>
            <h3 style={{ fontSize: '14px', marginBottom: '6px' }}>Backend Service Two</h3>
            <p style={{ fontSize: '12px', opacity: 0.85 }}>Port 5002</p>
            <p style={{ fontSize: '12px', opacity: 0.85 }}>Serves Assignment 2 &amp; sends emails</p>
          </div>
        </div>
      </div>

    </div>
  );
}
