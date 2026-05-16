import React from 'react';
import { Link } from 'react-router-dom';

const s = {
  container: { maxWidth: '860px', margin: '40px auto', padding: '0 20px' },
  card: {
    background: '#fff', borderRadius: '8px', padding: '30px',
    marginBottom: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  h1: { fontSize: '28px', marginBottom: '6px', color: '#1a73e8' },
  h2: {
    fontSize: '20px', marginBottom: '14px', color: '#333',
    borderBottom: '2px solid #1a73e8', paddingBottom: '6px',
  },
  infoRow: { marginBottom: '8px', fontSize: '15px' },
  label: { display: 'inline-block', width: '170px', color: '#555', fontWeight: 'bold' },
  courseSentence: {
    background: '#f0f4ff', borderLeft: '4px solid #1a73e8',
    padding: '12px 16px', borderRadius: '4px',
    fontFamily: 'monospace', fontSize: '14px', margin: '12px 0',
  },
  p: { lineHeight: '1.75', marginBottom: '14px', fontSize: '15px' },
  ul: { paddingLeft: '20px' },
  li: { marginBottom: '10px', fontSize: '15px' },
};

export default function Home() {
  return (
    <div style={s.container}>

      <div style={s.card}>
        <h1 style={s.h1}>Home Page</h1>
        <div style={s.infoRow}>
          <span style={s.label}>Full Name:</span> NZISABIRA Jean Nepomuscene
        </div>
        <div style={s.infoRow}>
          <span style={s.label}>Registration Number:</span> M02544_2023
        </div>
        <div style={s.courseSentence}>
          I am taking a course named &quot;Web Services and Service-Oriented Architecture&quot;
        </div>
      </div>

      <div style={s.card}>
        <h2 style={s.h2}>What I Have Learned So Far</h2>
        <p style={s.p}>
          In this course, I have learned the foundational concepts of web services and how modern
          applications communicate over the internet. I now understand the difference between REST and
          SOAP web services, how APIs are designed, and how frontend applications talk to backend
          services using HTTP methods such as GET, POST, PUT, and DELETE. I also learned how JSON is
          used as the standard data format for exchanging information between systems, and why it is
          preferred over XML in most modern web applications because it is lightweight and easy to read.
          I also learned how to use <code>axios</code> to make HTTP requests from a React frontend to
          a backend Express server.
        </p>
        <p style={s.p}>
          I have also gained practical experience with Node.js and Express to build backend web
          services, using the <code>xlsx</code> package to read and write Excel files programmatically,
          and the <code>nodemailer</code> package to send emails with attachments through a web service.
          I now understand the concept of Service-Oriented Architecture (SOA) — where a system is
          divided into independent, reusable services that communicate through well-defined APIs.
          This approach improves scalability, maintainability, and separation of concerns in software
          development. I can now build a full web application with a React frontend and multiple
          Express backend services, each serving a specific purpose and communicating through HTTP
          endpoints.
        </p>
      </div>

      <div style={s.card}>
        <h2 style={s.h2}>Assignments</h2>
        <ul style={s.ul}>
          <li style={s.li}>
            <Link to="/assignment1">Assignment 1</Link> — Excel data displayed as an interactive
            HTML table with editable Answer and Resources fields
          </li>
          <li style={s.li}>
            <Link to="/assignment2">Assignment 2</Link> — Served by a separate backend service
            (Backend Service Two, port 3002)
          </li>
        </ul>
      </div>

    </div>
  );
}
