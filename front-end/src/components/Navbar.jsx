import React from 'react';
import { NavLink } from 'react-router-dom';

const styles = {
  nav: {
    background: '#1a73e8',
    padding: '14px 30px',
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '15px',
    opacity: 0.85,
  },
  activeLink: {
    color: '#fff',
    textDecoration: 'underline',
    fontWeight: 'bold',
    fontSize: '15px',
    opacity: 1,
  },
};

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <NavLink to="/"             style={({ isActive }) => isActive ? styles.activeLink : styles.link}>Home</NavLink>
      <NavLink to="/assignment1"  style={({ isActive }) => isActive ? styles.activeLink : styles.link}>Assignment 1</NavLink>
      <NavLink to="/assignment2"  style={({ isActive }) => isActive ? styles.activeLink : styles.link}>Assignment 2</NavLink>
      <NavLink to="/combined"     style={({ isActive }) => isActive ? styles.activeLink : styles.link}>Combined</NavLink>
    </nav>
  );
}
