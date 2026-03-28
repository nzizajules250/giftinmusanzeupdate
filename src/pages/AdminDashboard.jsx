import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  addDoc, collection, onSnapshot, orderBy,
  query, serverTimestamp, updateDoc, doc, deleteDoc,
} from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '../firebase.js'
import { useTheme } from '../context/ThemeContext.jsx'

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
const Icon = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d={d} />
  </svg>
)
const ICONS = {
  bell:      'M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z',
  announce:  'M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.96.74-2.21 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.99-.74 2.24-1.68 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z',
  chat:      'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z',
  booking:   'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',
  logout:    'M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z',
  sun:       'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z',
  moon:      'M10 2c-1.82 0-3.53.5-5 1.35C7.99 5.08 10 8.3 10 12s-2.01 6.92-5 8.65C6.47 21.5 8.18 22 10 22c5.52 0 10-4.48 10-10S15.52 2 10 2z',
  trash:     'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
  check:     'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
  user:      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  send:      'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z',
  dash:      'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');

  :root {
    --gold:      #c8a96e;
    --gold-lt:   #d9be8a;
    --gold-dim:  rgba(200,169,110,0.12);
    --dark:      #0f0c08;
    --dark2:     #1a1410;
    --dark3:     #241c14;
    --dark4:     #2e2418;
    --ivory:     #faf8f3;
    --sand:      #e8e0d0;
    --muted:     #5a4e42;
    --sidebar-w: 220px;
    --serif:     'Cormorant Garamond', Georgia, serif;
    --sans:      'Jost', sans-serif;
  }

  .ad-wrap * { box-sizing: border-box; margin: 0; padding: 0; }
  .ad-wrap {
    font-family: var(--sans);
    background: var(--dark);
    color: var(--ivory);
    min-height: 100vh;
    display: grid;
    grid-template-columns: var(--sidebar-w) 1fr;
  }
  @media (max-width: 900px) {
    /* collapse to a single column on smaller screens */
    .ad-wrap { grid-template-columns: 1fr; }
  }

  /* ════════════════════════════
     SIDEBAR
  ════════════════════════════ */
  .ad-sidebar {
    /* removed fixed positioning so the sidebar participates in the grid
       this prevents the main content from sliding underneath and makes
       resizing behaviour more predictable */
    width: var(--sidebar-w);
    background: var(--dark2);
    border-right: 1px solid rgba(200,169,110,0.14);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    z-index: 200;
  }
  @media (max-width: 900px) {
    .ad-sidebar {
      position: static;
      width: 100%;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      gap: 0;
      border-right: none;
      border-bottom: 1px solid rgba(200,169,110,0.14);
    }
  }

  /* Brand */
  .ad-brand {
    padding: 24px 20px 20px;
    border-bottom: 1px solid rgba(200,169,110,0.1);
    flex-shrink: 0;
  }
  .ad-brand-logo {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 300;
    color: var(--ivory);
    letter-spacing: 0.04em;
    line-height: 1;
  }
  .ad-brand-logo span { color: var(--gold); font-style: italic; }
  .ad-brand-sub {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.3);
    margin-top: 5px;
  }

  /* User pill */
  .ad-user {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(200,169,110,0.08);
    flex-shrink: 0;
  }
  .ad-user-avatar {
    width: 30px; height: 30px;
    border-radius: 50%;
    background: var(--dark3);
    border: 1px solid rgba(200,169,110,0.3);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold);
    flex-shrink: 0;
  }
  .ad-user-name {
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 400;
    color: rgba(250,248,243,0.65);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ad-user-role {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    margin-top: 2px;
  }

  /* Nav */
  .ad-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .ad-nav-label {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.2);
    padding: 8px 10px 4px;
    margin-top: 8px;
  }
  .ad-nav-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: transparent;
    border: none;
    color: rgba(250,248,243,0.5);
    font-family: var(--sans);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    text-align: left;
    transition: color 0.25s, background 0.25s;
    position: relative;
  }
  .ad-nav-btn::before {
    content: '';
    position: absolute;
    left: 0; top: 4px; bottom: 4px;
    width: 2px;
    background: var(--gold);
    opacity: 0;
    transition: opacity 0.25s;
  }
  .ad-nav-btn:hover { color: var(--ivory); background: var(--gold-dim); }
  .ad-nav-btn:hover::before { opacity: 1; }
  .ad-nav-btn.active { color: var(--gold); background: var(--gold-dim); }
  .ad-nav-btn.active::before { opacity: 1; }
  .ad-nav-btn-badge {
    margin-left: auto;
    min-width: 18px; height: 18px;
    background: var(--gold);
    color: var(--dark);
    font-size: 9px;
    font-weight: 700;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    padding: 0 5px;
  }

  /* Sidebar footer */
  .ad-sidebar-footer {
    padding: 14px 12px;
    border-top: 1px solid rgba(200,169,110,0.1);
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex-shrink: 0;
  }
  .ad-footer-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 12px;
    background: transparent;
    border: 1px solid rgba(200,169,110,0.2);
    color: rgba(250,248,243,0.5);
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: color 0.3s, border-color 0.3s;
    width: 100%;
  }
  .ad-footer-btn:hover { color: var(--gold); border-color: var(--gold); }
  .ad-footer-btn.danger:hover { color: #c97b84; border-color: #c97b84; }

  /* ════════════════════════════
     MAIN AREA
  ════════════════════════════ */
  .ad-main {
    /* no margin-left required when sidebar is part of grid layout */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--dark);
  }
  /* media rule retained only to override any external overrides that
     might add a margin, but not strictly necessary now */
  @media (max-width: 900px) { .ad-main { margin-left: 0; } }

  /* Centered content container */
  .ad-inner {
    width: min(1200px, calc(100% - 48px));
    margin: 0 auto;
    /* ensure content doesn't hug the edge when sidebar is visible */
    padding-left: 24px;
    padding-right: 24px;
  }

  /* Top bar */
  .ad-topbar {
    background: var(--dark2);
    border-bottom: 1px solid rgba(200,169,110,0.12);
    padding: 16px 0;
    flex-shrink: 0;
    position: sticky;
    top: 0;
    z-index: 150; /* sit above content but below sidebar */
  }
  .ad-topbar-title {
    font-family: var(--serif);
    font-size: 26px;
    font-weight: 300;
    color: var(--ivory);
    line-height: 1;
  }
  .ad-topbar-title em { font-style: italic; color: var(--gold); }
  .ad-topbar-sub {
    font-size: 11px;
    font-weight: 300;
    color: rgba(250,248,243,0.38);
    margin-top: 4px;
    letter-spacing: 0.05em;
  }

  /* Stats strip */
  .ad-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 16px 0;
    flex-shrink: 0;
  }
  @media (max-width: 700px) { .ad-stats { grid-template-columns: repeat(2,1fr); } }
  .ad-stat {
    background: var(--dark2);
    padding: 18px 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    border: 1px solid rgba(200,169,110,0.1);
    box-shadow: 0 10px 30px rgba(0,0,0,0.28);
    transition: background 0.3s, transform 0.2s;
  }
  .ad-stat:hover { background: var(--dark3); transform: translateY(-2px); }
  .ad-stat-icon {
    width: 36px; height: 36px;
    background: var(--gold-dim);
    border: 1px solid rgba(200,169,110,0.25);
    display: flex; align-items: center; justify-content: center;
    color: var(--gold);
    flex-shrink: 0;
  }
  .ad-stat-num {
    font-family: var(--serif);
    font-size: 30px;
    font-weight: 300;
    color: var(--ivory);
    line-height: 1;
  }
  .ad-stat-label {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.35);
    margin-top: 3px;
  }

  /* Content area */
  .ad-content {
    padding: 32px 0 48px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    flex: 1;
  }
  .ad-content > * {
    width: 100%;
  }

  .ad-section-block {
    background: radial-gradient(circle at 20% 20%, rgba(200,169,110,0.08), transparent 35%),
                linear-gradient(180deg, rgba(26,20,16,0.9), rgba(15,12,8,0.92));
    border: 1px solid rgba(200,169,110,0.12);
    box-shadow: 0 16px 50px rgba(0,0,0,0.35);
    padding: 24px 24px 30px;
  }

  .ad-overview-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(180px,1fr));
    gap: 14px;
    margin-top: 18px;
  }
  @media (max-width: 900px) { .ad-overview-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
  @media (max-width: 560px) { .ad-overview-grid { grid-template-columns: 1fr; } }

  .ad-overview-actions {
    display: grid;
    grid-template-columns: repeat(2, minmax(0,1fr));
    gap: 16px;
    margin-top: 18px;
  }
  @media (max-width: 720px) { .ad-overview-actions { grid-template-columns: 1fr; } }

  /* Section titles */
  .ad-section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .ad-section-title {
    font-family: var(--serif);
    font-size: 20px;
    font-weight: 300;
    color: var(--ivory);
  }
  .ad-section-title em { font-style: italic; color: var(--gold); }
  .ad-section-eyebrow {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 6px;
  }

  /* Two-col grid */
  .ad-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  @media (max-width: 760px) { .ad-grid-2 { grid-template-columns: 1fr; } }

  /* Card shell */
  .ad-card {
    background: var(--dark2);
    border: 1px solid rgba(200,169,110,0.12);
    padding: 22px 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  }

  /* Form elements */
  .ad-label {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.4);
    display: flex;
    flex-direction: column;
    gap: 7px;
  }
  .ad-input, .ad-select, .ad-textarea {
    font-family: var(--sans);
    font-size: 13px;
    font-weight: 300;
    color: var(--ivory);
    background: var(--dark3);
    border: 1px solid rgba(200,169,110,0.15);
    padding: 11px 14px;
    outline: none;
    width: 100%;
    transition: border-color 0.3s;
    appearance: none;
    border-radius: 0;
  }
  .ad-input::placeholder, .ad-textarea::placeholder { color: rgba(250,248,243,0.2); }
  .ad-input:focus, .ad-select:focus, .ad-textarea:focus { border-color: var(--gold); }
  .ad-textarea { min-height: 90px; resize: vertical; }
  .ad-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='5'%3E%3Cpath d='M0 0l4 5 4-5z' fill='%23c8a96e'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 32px;
    cursor: pointer;
  }
  .ad-select option { background: var(--dark2); color: var(--ivory); }

  .ad-form-row { display: grid; gap: 12px; }
  .ad-form-row-2 { grid-template-columns: 1fr 1fr; }
  @media (max-width: 500px) { .ad-form-row-2 { grid-template-columns: 1fr; } }

  /* Submit button */
  .ad-submit {
    font-family: var(--sans);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--dark);
    background: var(--gold);
    border: none;
    padding: 13px 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    width: fit-content;
    position: relative;
    overflow: hidden;
    transition: background 0.3s, transform 0.2s;
  }
  .ad-submit::before {
    content: '';
    position: absolute; inset: 0; left: -100%;
    width: 60%;
    background: linear-gradient(120deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.45s ease;
  }
  .ad-submit:hover::before { left: 150%; }
  .ad-submit:hover { background: var(--gold-lt); transform: translateY(-1px); }

  /* ── Data rows ── */
  .ad-rows { display: flex; flex-direction: column; gap: 0; }

  .ad-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(200,169,110,0.08);
    animation: adRowIn 0.35s ease forwards;
    opacity: 0;
  }
  @keyframes adRowIn {
    to { opacity: 1; }
  }
  .ad-row:last-child { border-bottom: none; }
  .ad-row-left { flex: 1; min-width: 0; }
  .ad-row-main {
    font-size: 13px;
    font-weight: 400;
    color: var(--ivory);
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .ad-row-meta {
    font-size: 11px;
    font-weight: 300;
    color: rgba(250,248,243,0.38);
    margin-top: 4px;
    line-height: 1.5;
  }
  .ad-row-type {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding: 3px 8px;
    border: 1px solid;
    flex-shrink: 0;
    margin-top: 2px;
    display: inline-block;
  }
  .ad-row-type.info    { color: #4a9ecc; border-color: rgba(74,158,204,0.35); }
  .ad-row-type.success { color: #4caf7d; border-color: rgba(76,175,125,0.35); }
  .ad-row-type.warning { color: var(--gold); border-color: rgba(200,169,110,0.35); }
  .ad-row-type.error   { color: #c97b84; border-color: rgba(201,123,132,0.35); }

  /* Delete button */
  .ad-del-btn {
    background: transparent;
    border: 1px solid rgba(201,123,132,0.3);
    color: rgba(201,123,132,0.6);
    padding: 7px 10px;
    cursor: pointer;
    font-size: 0;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.3s, color 0.3s, background 0.3s;
  }
  .ad-del-btn:hover {
    border-color: #c97b84;
    color: #c97b84;
    background: rgba(201,123,132,0.06);
  }

  /* Empty state */
  .ad-empty {
    padding: 42px 0;
    text-align: center;
    font-size: 13px;
    font-weight: 400;
    color: rgba(250,248,243,0.4);
    letter-spacing: 0.08em;
    font-style: italic;
  }

  /* ── Bookings table ── */
  .ad-table-wrap {
    overflow-x: auto;
  }
  .ad-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .ad-table th {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.3);
    padding: 10px 14px;
    text-align: left;
    border-bottom: 1px solid rgba(200,169,110,0.12);
    white-space: nowrap;
  }
  .ad-table td {
    padding: 13px 14px;
    border-bottom: 1px solid rgba(200,169,110,0.06);
    vertical-align: middle;
    color: rgba(250,248,243,0.75);
    font-weight: 300;
    white-space: nowrap;
  }
  .ad-table tr:last-child td { border-bottom: none; }
  .ad-table tr:hover td { background: rgba(200,169,110,0.04); }
  .ad-table td:first-child { color: var(--ivory); font-weight: 400; }

  /* Status select */
  .ad-status-select {
    font-family: var(--sans);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 5px 24px 5px 10px;
    background: var(--dark3);
    border: 1px solid rgba(200,169,110,0.2);
    color: var(--ivory);
    cursor: pointer;
    outline: none;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='7' height='4'%3E%3Cpath d='M0 0l3.5 4L7 0z' fill='%23c8a96e'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    transition: border-color 0.3s;
    border-radius: 0;
  }
  .ad-status-select:focus { border-color: var(--gold); }
  .ad-status-select option { background: var(--dark2); }
  .ad-status-select[value="confirmed"] { color: #4caf7d; border-color: rgba(76,175,125,0.35); }
  .ad-status-select[value="cancelled"] { color: #c97b84; border-color: rgba(201,123,132,0.35); }

  /* Status badge */
  .ad-status-badge {
    font-size: 9px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 3px 8px;
    border: 1px solid;
    display: inline-block;
  }
  .ad-status-badge.pending   { color: var(--gold);  border-color: rgba(200,169,110,0.35); }
  .ad-status-badge.confirmed { color: #4caf7d;       border-color: rgba(76,175,125,0.35);  }
  .ad-status-badge.cancelled { color: #c97b84;       border-color: rgba(201,123,132,0.35); }

  /* Not-logged-in screen */
  .ad-auth-screen {
    min-height: 100vh;
    background: var(--dark);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }
  .ad-auth-card {
    background: var(--dark2);
    border: 1px solid rgba(200,169,110,0.18);
    padding: 52px 44px;
    text-align: center;
    max-width: 380px;
    width: 100%;
  }
  .ad-auth-logo {
    font-family: var(--serif);
    font-size: 32px;
    font-weight: 300;
    color: var(--ivory);
    margin-bottom: 8px;
  }
  .ad-auth-logo span { color: var(--gold); font-style: italic; }
  .ad-auth-subtitle {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(250,248,243,0.3);
    margin-bottom: 32px;
  }
  .ad-auth-title {
    font-family: var(--serif);
    font-size: 26px;
    font-weight: 300;
    color: var(--ivory);
    margin-bottom: 12px;
  }
  .ad-auth-desc {
    font-size: 13px;
    font-weight: 300;
    color: rgba(250,248,243,0.45);
    line-height: 1.7;
    margin-bottom: 32px;
  }
  .ad-auth-hint {
    font-size: 11px;
    font-weight: 300;
    color: rgba(250,248,243,0.25);
    margin-top: 20px;
    font-style: italic;
  }
`

/* ── Helpers ─────────────────────────────────────────────────────────────── */
const fmtDate = (ts) => {
  if (!ts) return '—'
  const d = ts?.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const NAV_ITEMS = [
  { id: 'overview',   label: 'Overview',      icon: ICONS.dash },
  { id: 'bookings',   label: 'Bookings',      icon: ICONS.booking },
  { id: 'notify',     label: 'Notifications', icon: ICONS.bell },
  { id: 'announce',   label: 'Announcements', icon: ICONS.announce },
  { id: 'chat',       label: 'Live Chat',     icon: ICONS.chat },
]

function AdminDashboard() {
  const navigate   = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [user, setUser]               = useState(null)
  const [authReady, setAuthReady]     = useState(false)
  const [activeNav, setActiveNav]     = useState('overview')
  const [bookings, setBookings]       = useState([])
  const [notifications, setNotifications] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [chatMessages, setChatMessages]   = useState([])
  const [noteForm, setNoteForm]           = useState({ message: '', type: 'info' })
  const [annForm, setAnnForm]             = useState({ title: '', body: '' })
  const [statusBusy, setStatusBusy]       = useState('')

  useEffect(() => {
    const stop = onAuthStateChanged(auth, (u) => { setUser(u); setAuthReady(true) })
    return () => stop()
  }, [])

  useEffect(() => {
    if (!user) return
    const unsubs = [
      onSnapshot(query(collection(db, 'bookings'),      orderBy('createdAt', 'desc')), (s) => setBookings(s.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(collection(db, 'notifications'), orderBy('createdAt', 'desc')), (s) => setNotifications(s.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(collection(db, 'announcements'), orderBy('createdAt', 'desc')), (s) => setAnnouncements(s.docs.map((d) => ({ id: d.id, ...d.data() })))),
      onSnapshot(query(collection(db, 'chatMessages'),  orderBy('createdAt', 'desc')), (s) => setChatMessages(s.docs.map((d) => ({ id: d.id, ...d.data() })))),
    ]
    return () => unsubs.forEach((u) => u())
  }, [user])

  const navigateSection = (id) => {
    setActiveNav(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitNotification = async (e) => {
    e.preventDefault()
    if (!noteForm.message) return
    await addDoc(collection(db, 'notifications'), {
      message: noteForm.message, type: noteForm.type,
      active: true, createdAt: serverTimestamp(),
    })
    setNoteForm({ message: '', type: 'info' })
  }

  const submitAnnouncement = async (e) => {
    e.preventDefault()
    if (!annForm.title || !annForm.body) return
    await addDoc(collection(db, 'announcements'), {
      title: annForm.title, body: annForm.body,
      active: true, createdAt: serverTimestamp(),
    })
    setAnnForm({ title: '', body: '' })
  }

  const handleStatus = async (id, status) => {
    setStatusBusy(id)
    try { await updateDoc(doc(db, 'bookings', id), { status }) }
    finally { setStatusBusy('') }
  }

  /* ── Not ready ── */
  if (!authReady) {
    return (
      <div className="ad-auth-screen" style={{ fontFamily: 'Jost, sans-serif' }}>
        <style>{css}</style>
        <p style={{ color: 'rgba(250,248,243,0.3)', fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Loading...
        </p>
      </div>
    )
  }

  /* ── Not logged in ── */
  if (!user) {
    return (
      <div className="ad-auth-screen">
        <style>{css}</style>
        <div className="ad-auth-card">
          <p className="ad-auth-logo">Gift<span>Inn</span></p>
          <p className="ad-auth-subtitle">Admin Portal</p>
          <h1 className="ad-auth-title">Authentication Required</h1>
          <p className="ad-auth-desc">
            Only authorised GiftInn staff may access this dashboard. Please sign in to continue.
          </p>
          <button
            type="button"
            className="ad-submit"
            style={{ margin: '0 auto' }}
            onClick={() => navigate('/')}
          >
            <Icon d={ICONS.logout} size={14} />
            Back to Website
          </button>
          <p className="ad-auth-hint">Double-tap the GiftInn logo on the home page to sign in.</p>
        </div>
      </div>
    )
  }

  /* ── Dashboard ── */
  return (
    <div className="ad-wrap">
      <style>{css}</style>

      {/* ════ SIDEBAR ════ */}
      <aside className="ad-sidebar">
        {/* Brand */}
        <div className="ad-brand">
          <p className="ad-brand-logo">Gift<span>Inn</span></p>
          <p className="ad-brand-sub">Admin Dashboard</p>
        </div>

        {/* User */}
        <div className="ad-user">
          <div className="ad-user-avatar">
            <Icon d={ICONS.user} size={14} />
          </div>
          <div>
            <p className="ad-user-name">{user.email?.split('@')[0] || 'Admin'}</p>
            <p className="ad-user-role">Administrator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="ad-nav">
          <p className="ad-nav-label">Navigation</p>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`ad-nav-btn${activeNav === item.id ? ' active' : ''}`}
              onClick={() => navigateSection(item.id)}
            >
              <Icon d={item.icon} size={14} />
              {item.label}
              {item.id === 'bookings'    && bookings.length > 0     && <span className="ad-nav-btn-badge">{bookings.length}</span>}
              {item.id === 'notify'      && notifications.length > 0 && <span className="ad-nav-btn-badge">{notifications.length}</span>}
              {item.id === 'announce'    && announcements.length > 0 && <span className="ad-nav-btn-badge">{announcements.length}</span>}
              {item.id === 'chat'        && chatMessages.length > 0  && <span className="ad-nav-btn-badge">{chatMessages.length}</span>}
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="ad-sidebar-footer">
          <button type="button" className="ad-footer-btn" onClick={toggleTheme}>
            <Icon d={theme === 'dark' ? ICONS.sun : ICONS.moon} size={13} />
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            type="button"
            className="ad-footer-btn danger"
            onClick={async () => { await signOut(auth); navigate('/') }}
          >
            <Icon d={ICONS.logout} size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ════ MAIN ════ */}
      <main className="ad-main">

        {/* Top bar */}
        <div className="ad-topbar">
          <div className="ad-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p className="ad-topbar-title" id="ad-overview">GiftInn <em>Dashboard</em></p>
              <p className="ad-topbar-sub">Manage bookings, notifications, announcements and live chat</p>
            </div>
          </div>
        </div>

        <div className="ad-inner">
        <div className="ad-content">

          {activeNav === 'overview' && (
            <div className="ad-section-block">
              <div className="ad-section-header">
                <div>
                  <p className="ad-section-eyebrow">Snapshot</p>
                  <h2 className="ad-section-title">Today&#39;s <em>Overview</em></h2>
                </div>
              </div>
              <div className="ad-overview-grid">
                {[
                  { icon: ICONS.booking,  num: bookings.length,       label: 'Bookings'       },
                  { icon: ICONS.bell,     num: notifications.length,  label: 'Notifications'  },
                  { icon: ICONS.announce, num: announcements.length,  label: 'Announcements'  },
                  { icon: ICONS.chat,     num: chatMessages.length,   label: 'Chat Messages'  },
                ].map((s) => (
                  <div className="ad-stat" key={s.label}>
                    <div className="ad-stat-icon"><Icon d={s.icon} size={16} /></div>
                    <div>
                      <div className="ad-stat-num">{s.num}</div>
                      <div className="ad-stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="ad-overview-actions">
                <div className="ad-card">
                  <p className="ad-section-eyebrow">Priority</p>
                  <h3 className="ad-section-title" style={{ fontSize: 18 }}>Jump to <em>Bookings</em></h3>
                  <p className="ad-row-meta" style={{ marginTop: 10 }}>Review new booking requests and set status.</p>
                  <button type="button" className="ad-submit" style={{ marginTop: 14 }} onClick={() => navigateSection('bookings')}>
                    <Icon d={ICONS.booking} size={13} />
                    Go to Bookings
                  </button>
                </div>
                <div className="ad-card">
                  <p className="ad-section-eyebrow">Engage</p>
                  <h3 className="ad-section-title" style={{ fontSize: 18 }}>Send <em>Updates</em></h3>
                  <p className="ad-row-meta" style={{ marginTop: 10 }}>Publish notifications or announcements to guests.</p>
                  <div style={{ display: 'flex', gap: 10, marginTop: 14, flexWrap: 'wrap' }}>
                    <button type="button" className="ad-submit" onClick={() => navigateSection('notify')}>
                      <Icon d={ICONS.bell} size={13} />
                      Notifications
                    </button>
                    <button type="button" className="ad-submit" onClick={() => navigateSection('announce')}>
                      <Icon d={ICONS.announce} size={13} />
                      Announcements
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'bookings' && (
            <div id="ad-bookings" className="ad-section-block">
              <div className="ad-section-header">
                <div>
                  <p className="ad-section-eyebrow">Reservations</p>
                  <h2 className="ad-section-title">Booking <em>Requests</em></h2>
                </div>
              </div>
              <div className="ad-card" style={{ padding: 0, overflow: 'hidden' }}>
                {bookings.length === 0 ? (
                  <p className="ad-empty">No booking requests yet.</p>
                ) : (
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th>Guest</th>
                          <th>Room</th>
                          <th>Check-in</th>
                          <th>Check-out</th>
                          <th>Guests</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b, idx) => (
                          <tr key={b.id} style={{ animationDelay: `${idx * 0.04}s` }}>
                            <td>{b.fullName || '—'}</td>
                            <td>{b.roomName || b.roomType || '—'}</td>
                            <td>{b.checkIn  || '—'}</td>
                            <td>{b.checkOut || '—'}</td>
                            <td>{b.guests   || '—'}</td>
                            <td>
                              <select
                                className="ad-status-select"
                                value={b.status || 'pending'}
                                onChange={(e) => handleStatus(b.id, e.target.value)}
                                disabled={statusBusy === b.id}
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {(activeNav === 'notify' || activeNav === 'announce') && (
            <div className="ad-grid-2 ad-section-block">

              {/* Send notification */}
              <div id="ad-notify">
                <div className="ad-section-header">
                  <div>
                    <p className="ad-section-eyebrow">Push</p>
                    <h2 className="ad-section-title">Send <em>Notification</em></h2>
                  </div>
                </div>
                <div className="ad-card">
                  <form onSubmit={submitNotification} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <label className="ad-label">
                      Message
                      <textarea
                        className="ad-textarea"
                        placeholder="Write your notification message..."
                        value={noteForm.message}
                        onChange={(e) => setNoteForm({ ...noteForm, message: e.target.value })}
                        required
                      />
                    </label>
                    <label className="ad-label">
                      Type
                      <select
                        className="ad-select"
                        value={noteForm.type}
                        onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
                      >
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                      </select>
                    </label>
                    <button type="submit" className="ad-submit">
                      <Icon d={ICONS.send} size={13} />
                      Publish Notification
                    </button>
                  </form>

                  {notifications.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(200,169,110,0.1)', paddingTop: 16 }}>
                      <p className="ad-section-eyebrow" style={{ marginBottom: 10 }}>Published</p>
                      <div className="ad-rows">
                        {notifications.slice(0, 5).map((n, idx) => (
                          <div className="ad-row" key={n.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                            <div className="ad-row-left">
                              <p className="ad-row-main">{n.message}</p>
                              <p className="ad-row-meta">{fmtDate(n.createdAt)}</p>
                            </div>
                            <span className={`ad-row-type ${n.type || 'info'}`}>{n.type || 'info'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Add announcement */}
              <div id="ad-announce">
                <div className="ad-section-header">
                  <div>
                    <p className="ad-section-eyebrow">Broadcast</p>
                    <h2 className="ad-section-title">Add <em>Announcement</em></h2>
                  </div>
                </div>
                <div className="ad-card">
                  <form onSubmit={submitAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <label className="ad-label">
                      Title
                      <input
                        className="ad-input"
                        placeholder="e.g. Seasonal Offer — 20% Off"
                        value={annForm.title}
                        onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                        required
                      />
                    </label>
                    <label className="ad-label">
                      Body
                      <textarea
                        className="ad-textarea"
                        placeholder="Describe the announcement in detail..."
                        value={annForm.body}
                        onChange={(e) => setAnnForm({ ...annForm, body: e.target.value })}
                        required
                      />
                    </label>
                    <button type="submit" className="ad-submit">
                      <Icon d={ICONS.announce} size={13} />
                      Publish Announcement
                    </button>
                  </form>

                  {announcements.length > 0 && (
                    <div style={{ borderTop: '1px solid rgba(200,169,110,0.1)', paddingTop: 16 }}>
                      <p className="ad-section-eyebrow" style={{ marginBottom: 10 }}>Active</p>
                      <div className="ad-rows">
                        {announcements.map((a, idx) => (
                          <div className="ad-row" key={a.id} style={{ animationDelay: `${idx * 0.05}s` }}>
                            <div className="ad-row-left">
                              <p className="ad-row-main">{a.title}</p>
                              <p className="ad-row-meta">{a.body}</p>
                            </div>
                            <button
                              type="button"
                              className="ad-del-btn"
                              onClick={() => deleteDoc(doc(db, 'announcements', a.id))}
                              aria-label="Delete announcement"
                            >
                              <Icon d={ICONS.trash} size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeNav === 'chat' && (
            <div id="ad-chat" className="ad-section-block">
              <div className="ad-section-header">
                <div>
                  <p className="ad-section-eyebrow">Inbox</p>
                  <h2 className="ad-section-title">Live Chat <em>Messages</em></h2>
                </div>
              </div>
              <div className="ad-card" style={{ padding: 0, overflow: 'hidden' }}>
                {chatMessages.length === 0 ? (
                  <p className="ad-empty">No chat messages yet.</p>
                ) : (
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th>Message</th>
                          <th>Session</th>
                          <th>Page</th>
                          <th>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chatMessages.map((m, idx) => (
                          <tr key={m.id} style={{ animationDelay: `${idx * 0.04}s` }}>
                            <td style={{ maxWidth: 280, whiteSpace: 'normal' }}>{m.message || '—'}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(250,248,243,0.35)' }}>
                              {m.sessionId ? `${m.sessionId.slice(0, 8)}...` : 'unknown'}
                            </td>
                            <td>{m.page || '/'}</td>
                            <td>{fmtDate(m.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
