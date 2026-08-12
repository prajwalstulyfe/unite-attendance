import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unite Attendance - Complete Product Guide & Exhaustive Operational Manual</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4f46e5;
      --primary-dark: #4338ca;
      --primary-light: #6366f1;
      --secondary: #06b6d4;
      --accent: #8b5cf6;
      --bg: #090d16;
      --bg-card: #111827;
      --bg-card-hover: #1f2937;
      --text: #f9fafb;
      --text-muted: #9ca3af;
      --border: #1f2937;
      --border-accent: #374151;
      --success: #10b981;
      --warning: #f59e0b;
      --danger: #ef4444;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    /* Screen Sticky Action Header */
    .screen-action-bar {
      position: sticky; top: 0; z-index: 1000;
      background: rgba(17, 24, 39, 0.95);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      padding: 14px 32px;
      display: flex; justify-content: space-between; align-items: center;
    }

    .brand-logo {
      display: flex; align-items: center; gap: 12px;
      font-weight: 800; font-size: 1.25rem; color: #fff;
    }

    .brand-badge {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      padding: 4px 10px; border-radius: 8px;
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.5px; color: #fff;
    }

    .btn-print {
      background: linear-gradient(135deg, var(--primary), var(--primary-light));
      color: #fff; border: none; padding: 10px 20px; border-radius: 12px;
      font-weight: 700; font-size: 0.875rem; cursor: pointer;
      display: flex; align-items: center; gap: 8px;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4); transition: all 0.2s ease;
    }

    .btn-print:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(79, 70, 229, 0.6); }

    .container { max-width: 1240px; margin: 0 auto; padding: 40px 24px; }

    /* Executive Cover Page */
    .cover-hero {
      background: radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.28), transparent 70%),
                  linear-gradient(180deg, var(--bg-card) 0%, var(--bg) 100%);
      border: 1px solid var(--border); border-radius: 32px;
      padding: 72px 40px; text-align: center; margin-bottom: 48px;
    }

    .cover-title {
      font-size: 3.8rem; font-weight: 800; letter-spacing: -1.5px;
      line-height: 1.12; margin-bottom: 16px;
      background: linear-gradient(135deg, #ffffff 30%, #9ca3af 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }

    .cover-subtitle { font-size: 1.3rem; color: var(--text-muted); max-width: 960px; margin: 0 auto 36px auto; }
    .pill-tags { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
    .pill { background: rgba(31, 41, 55, 0.8); border: 1px solid var(--border-accent); padding: 6px 16px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; color: var(--secondary); }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }
    .grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; margin-bottom: 32px; }
    .grid-5 { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }

    @media (max-width: 900px) { .grid-2, .grid-3, .grid-5 { grid-template-columns: 1fr; } }

    .card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 28px; }
    .card-title { font-size: 1.25rem; font-weight: 800; margin-bottom: 12px; color: #fff; display: flex; align-items: center; gap: 10px; }
    .card-desc { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }

    .app-box {
      background: #0d1117; border: 1px solid var(--border); border-radius: 20px; padding: 20px;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .app-tag { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 700; color: var(--secondary); background: rgba(6, 182, 212, 0.1); padding: 2px 8px; border-radius: 6px; width: fit-content; margin-bottom: 8px; }
    .app-name { font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 6px; }
    .app-desc { font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; }

    .section-header { margin: 60px 0 24px 0; padding-bottom: 16px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-end; }
    .section-num { font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; color: var(--primary-light); font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .section-title { font-size: 2rem; font-weight: 800; color: #fff; margin-top: 4px; }

    .step-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; margin-bottom: 36px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
    .step-header { background: rgba(31, 41, 55, 0.6); padding: 20px 28px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
    .step-number-badge { background: linear-gradient(135deg, var(--primary), var(--accent)); color: #fff; font-weight: 800; font-size: 0.8rem; padding: 4px 14px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; }

    .step-body { padding: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    @media (max-width: 900px) { .step-body { grid-template-columns: 1fr; } }

    .step-info h4 { font-size: 1.35rem; font-weight: 800; color: #fff; margin-bottom: 12px; }
    .step-info p { font-size: 0.92rem; color: var(--text-muted); margin-bottom: 20px; line-height: 1.6; }
    .feature-list { list-style: none; margin-bottom: 20px; }
    .feature-list li { position: relative; padding-left: 24px; margin-bottom: 10px; font-size: 0.88rem; color: #e5e7eb; }
    .feature-list li::before { content: '✓'; position: absolute; left: 0; color: var(--success); font-weight: 800; }

    .mockup-window { background: #0d1117; border: 1px solid #30363d; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
    .mockup-header { background: #161b22; padding: 10px 16px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid #30363d; }
    .dot { width: 10px; height: 10px; border-radius: 50%; }
    .dot-red { background: #ff5f56; } .dot-yellow { background: #ffbd2e; } .dot-green { background: #27c93f; }
    .mockup-title { font-size: 0.75rem; color: #8b949e; font-family: 'JetBrains Mono', monospace; margin-left: auto; }
    .mockup-content { padding: 20px; font-size: 0.85rem; }

    .code-block { background: #0d1117; border: 1px solid var(--border); border-radius: 12px; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: #a5d6ff; overflow-x: auto; margin-top: 12px; line-height: 1.5; }

    table { width: 100%; border-collapse: collapse; margin: 20px 0; background: var(--bg-card); border-radius: 20px; overflow: hidden; border: 1px solid var(--border); }
    th, td { padding: 16px 20px; text-align: left; border-bottom: 1px solid var(--border); font-size: 0.88rem; }
    th { background: rgba(31, 41, 55, 0.9); color: #fff; font-weight: 800; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.5px; }
    td { color: var(--text-muted); }
    tr:last-child td { border-bottom: none; }
    .price-highlight { color: #7ee787; font-weight: 800; font-size: 1rem; }
    .regular-price { text-decoration: line-through; color: #8b949e; font-size: 0.8rem; margin-right: 6px; }

    @media print {
      .screen-action-bar { display: none !important; }
      body { background-color: #fff !important; color: #111827 !important; }
      .container { max-width: 100% !important; padding: 0 !important; }
      .cover-hero { background: #f9fafb !important; border: 2px solid #e5e7eb !important; color: #111827 !important; page-break-after: always; }
      .cover-title { background: none !important; -webkit-text-fill-color: #111827 !important; color: #111827 !important; }
      .card, .step-card, table, .mockup-window, .app-box { background: #ffffff !important; border: 1px solid #d1d5db !important; color: #111827 !important; box-shadow: none !important; page-break-inside: avoid; }
      .step-header { background: #f3f4f6 !important; border-bottom: 1px solid #e5e7eb !important; }
      .card-title, .step-info h4, .section-title, th, .app-name { color: #111827 !important; }
      .card-desc, .step-info p, td, .feature-list li, .app-desc { color: #374151 !important; }
      .mockup-header { background: #e5e7eb !important; border-bottom: 1px solid #d1d5db !important; }
      .section-header { page-break-before: always; }
    }
  </style>
</head>
<body>

  <!-- Screen Top Bar -->
  <div class="screen-action-bar">
    <div class="brand-logo">
      <span>Unite Attendance</span>
      <span class="brand-badge">Ultimate Product Guide</span>
    </div>
    <button class="btn-print" onclick="window.print()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
      Export / Save as PDF
    </button>
  </div>

  <div class="container">

    <!-- Cover Page -->
    <div class="cover-hero">
      <div style="font-size: 0.9rem; font-weight: 800; color: var(--secondary); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">Definitive Product Specification & Technical Architecture</div>
      <h1 class="cover-title">Unite Attendance System</h1>
      <p class="cover-subtitle">Complete end-to-end operational manual covering all 5 ecosystem applications, 13-stage lifecycle flow from signup to payroll, Prisma schema models, API matrix, security rules, and official subscription pricing.</p>
      
      <div class="pill-tags">
        <span class="pill">All 5 Monorepo Apps</span>
        <span class="pill">13 Operational Lifecycle Stages</span>
        <span class="pill">All 8 Admin Sidebar Tabs</span>
        <span class="pill">6 Settings Sub-Tabs</span>
        <span class="pill">6 Super Admin Tabs</span>
        <span class="pill">Official Pack Pricing (₹375 – ₹8,999/mo)</span>
      </div>
    </div>

    <!-- SECTION 1: ARCHITECTURE & MONOREPO APPS -->
    <div class="section-header">
      <div>
        <div class="section-num">Section 01</div>
        <h2 class="section-title">System Architecture & Monorepo Applications</h2>
      </div>
      <span style="color: var(--text-muted); font-weight: 600;">Ecosystem Engineering</span>
    </div>

    <div class="grid-5">
      <div class="app-box">
        <span class="app-tag">apps/web</span>
        <div class="app-name">Website & Marketing</div>
        <div class="app-desc">Public landing page, pricing pack selector, Razorpay subscription checkout, portal menu launcher, and product documentation.</div>
      </div>

      <div class="app-box">
        <span class="app-tag">apps/admin</span>
        <div class="app-name">Admin Dashboard</div>
        <div class="app-desc">Organization portal (/dashboard, /attendance, /branches, /departments, /members, /qr-management, /reports, /settings) and Super Admin portal (/super-admin).</div>
      </div>

      <div class="app-box">
        <span class="app-tag">apps/app</span>
        <div class="app-name">Employee Mobile App</div>
        <div class="app-desc">Mobile PWA for staff featuring geofenced GPS check-in/out, dynamic TOTP QR pass, history calendar, and profile badge.</div>
      </div>

      <div class="app-box">
        <span class="app-tag">apps/kiosk</span>
        <div class="app-name">Front-Desk Kiosk</div>
        <div class="app-desc">Hardware tablet scanning terminal with sub-second camera QR verification, visual cards, audio chimes, and auto-reset.</div>
      </div>

      <div class="app-box">
        <span class="app-tag">apps/api</span>
        <div class="app-name">Backend API Gateway</div>
        <div class="app-desc">NestJS REST API, WebSocket realtime gateway, Prisma ORM, PostgreSQL DB, JWT auth, and rules validation engine.</div>
      </div>
    </div>

    <!-- System Flow Architecture Diagram -->
    <div class="card" style="margin-bottom: 40px; text-align: center;">
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: #a5d6ff; line-height: 2; padding: 24px; background: #0d1117; border-radius: 16px; border: 1px solid var(--border);">
        [ Employee Mobile App ] ───(GPS + TOTP Pass)───► [ NestJS API Gateway ] ◄───(Realtime WS)─── [ Admin Dashboard ]
                                                                 │
        [ Front Desk Kiosk ]    ───(Sub-second Scan)───► [ Attendance Rules Engine ] ───► [ PostgreSQL & Prisma DB ]
      </div>
    </div>

    <!-- SECTION 2: PRISMA DATABASE SCHEMAS -->
    <div class="section-header">
      <div>
        <div class="section-num">Section 02</div>
        <h2 class="section-title">Database Models & Entity Data Schemas</h2>
      </div>
      <span style="color: var(--text-muted); font-weight: 600;">Prisma PostgreSQL ERD</span>
    </div>

    <div class="grid-2">
      <div class="card">
        <h4 style="color: #fff; font-size: 1.1rem; font-weight: 800; margin-bottom: 12px;">Core Data Models</h4>
        <ul class="feature-list" style="font-size: 0.85rem;">
          <li><strong>User:</strong> id, email, name, avatarUrl, passwordHash, globalRole (SUPER_ADMIN | USER), isActive.</li>
          <li><strong>Organization:</strong> id, name, slug, logo, plan (FREE | STARTER | PRO | ENTERPRISE), settings, isActive.</li>
          <li><strong>OrgMember:</strong> id, userId, orgId, role (ORG_ADMIN | BRANCH_MANAGER | DEPT_HEAD | MEMBER), departmentId, branchId, employeeId, designation, phone.</li>
          <li><strong>Branch:</strong> id, orgId, name, address, location (GPS Lat/Long JSON), isActive.</li>
          <li><strong>Department:</strong> id, orgId, branchId, headId, name.</li>
        </ul>
      </div>

      <div class="card">
        <h4 style="color: #fff; font-size: 1.1rem; font-weight: 800; margin-bottom: 12px;">Attendance & Verification Models</h4>
        <ul class="feature-list" style="font-size: 0.85rem;">
          <li><strong>QRCode:</strong> id, memberId, orgId, qrToken, type (MOBILE | ID_CARD), isActive, expiresAt.</li>
          <li><strong>AttendanceRecord:</strong> id, memberId, orgId, type (CHECK_IN | CHECK_OUT), timestamp, method (QR_MOBILE | QR_IDCARD | QR_KIOSK | MANUAL), status (VALID | INVALID | FLAGGED), validationErrors, notes.</li>
          <li><strong>AttendanceRule:</strong> id, orgId, workStart, workEnd, lateThresholdMin, halfDayThresholdMin, requireGps, gpsRadiusMeters, workingDays, preventDuplicateMin.</li>
          <li><strong>Subscription:</strong> id, orgId, razorpaySubscriptionId, plan, status (ACTIVE | PAST_DUE | CANCELLED | TRIALING).</li>
        </ul>
      </div>
    </div>

    <!-- SECTION 3: 13-STAGE LIFECYCLE WALKTHROUGH -->
    <div class="section-header">
      <div>
        <div class="section-num">Section 03</div>
        <h2 class="section-title">End-to-End Operational Lifecycle (13 Stages)</h2>
      </div>
      <span style="color: var(--text-muted); font-weight: 600;">Signup to Payroll Export</span>
    </div>

    <!-- Stage 1 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 1: Website Landing Page & Pack Selection</span>
        <span class="step-number-badge">apps/web</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Public Website & Pack Selection</h4>
          <p>The client visits the public web application, explores ecosystem features, and selects an active employee strength pack tier.</p>
          <ul class="feature-list">
            <li>Choose Pack Tier: Starter 10 (₹375/mo), Starter 25 (₹749/mo), Business 50 (₹1,125/mo), Pro Growth 100 (₹1,875/mo), Scale 200 (₹2,999/mo), Corporate 500 (₹5,249/mo), Enterprise 1000 (₹8,999/mo).</li>
            <li>Launch Discount: Flat 25% OFF billed monthly.</li>
            <li>14-Day Free Trial: Full feature access with no credit card required.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">uniteattendance.com/#pricing</span>
          </div>
          <div class="mockup-content">
            <div style="background: #161b22; padding: 12px; border-radius: 8px; border: 1px solid #30363d;">
              <strong style="color: #7ee787;">Pro Growth 100 Pack ★ (Popular)</strong>
              <div style="color: #8b949e; font-size: 0.75rem; margin-top: 4px;">51 – 100 Employees • Launch Price: ₹1,875/mo (₹18.75/emp)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 2 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 2: Registration & Workspace Provisioning</span>
        <span class="step-number-badge">apps/admin/app/register</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Account Signup & Organization Slug Creation</h4>
          <p>Organization Admin registers the corporate account. The system automatically provisions a tenant workspace with a unique slug.</p>
          <ul class="feature-list">
            <li>Input Company Name, Admin Name, Corporate Email, Password.</li>
            <li>Automated Organization Slug allocation (e.g., acme-corp).</li>
            <li>Razorpay checkout integration for subscription activation.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/register</span>
          </div>
          <div class="mockup-content">
            <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #30363d;">
              <div style="color: #58a6ff; font-weight: 700;">Account Created: Acme Corp</div>
              <div style="color: #8b949e; font-size: 0.72rem;">Workspace Slug: acme-corp • Admin: admin@acme.com</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 3 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 3: Corporate Profile Setup</span>
        <span class="step-number-badge">admin/settings -> PROFILE Sub-Tab</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Corporate Identity & Legal Entity Registration</h4>
          <p>Admin logs in and completes corporate profile details in the Settings PROFILE sub-tab.</p>
          <ul class="feature-list">
            <li>Organization Display Name & Legal Registered Entity Name.</li>
            <li>Industry Sector & Company Size Selection.</li>
            <li>Corporate Email, Phone, Website URL, GSTIN / Tax ID, HQ Address.</li>
            <li>Timezone (Asia/Kolkata IST) & Currency (INR ₹) defaults.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/settings?tab=PROFILE</span>
          </div>
          <div class="mockup-content">
            <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #30363d; font-family: monospace; font-size: 0.72rem;">
              <div style="color: #fff;">Legal Entity: Unite Technologies Pvt. Ltd.</div>
              <div style="color: #8b949e;">GSTIN: 27AAACU1234M1Z5 | Timezone: Asia/Kolkata</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 4 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 4: Attendance Shift & Geofence Policy Setup</span>
        <span class="step-number-badge">admin/settings -> RULES Sub-Tab</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Shift Hours, Grace Period & Geofence Configuration</h4>
          <p>Defines corporate work hours, late arrival grace thresholds, working days, and spatial GPS geofencing parameters.</p>
          <ul class="feature-list">
            <li>Shift Start (09:00 AM) & Shift End (06:00 PM).</li>
            <li>Late Grace Threshold (15 mins) & Half-Day Criteria (240 mins).</li>
            <li>Working Days Selector (Mon, Tue, Wed, Thu, Fri).</li>
            <li>Mandatory GPS Geofencing toggle & Allowed Radius (e.g. 200m).</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/settings?tab=RULES</span>
          </div>
          <div class="mockup-content">
            <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #30363d; font-family: monospace; font-size: 0.72rem;">
              <div style="color: #7ee787;">Shift: 09:00 - 18:00 | Grace: 15m</div>
              <div style="color: #8b949e;">Require GPS: True | Radius: 200 Meters</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 5 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 5: Branch Office Locations & Coordinates</span>
        <span class="step-number-badge">admin/branches</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Multi-Branch Mapping & Geofence Coordinates</h4>
          <p>Admins create physical office locations and configure latitude/longitude coordinates for mobile GPS verification.</p>
          <ul class="feature-list">
            <li>Branch Name, Physical Address, Active status toggle.</li>
            <li>GPS Latitude & Longitude coordinates.</li>
            <li>Branch Geofence radius in meters per office.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/branches</span>
          </div>
          <div class="mockup-content">
            <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #30363d;">
              <div style="color: #58a6ff; font-weight: 700;">SF HQ Branch</div>
              <div style="color: #8b949e; font-size: 0.72rem;">Lat: 37.7749° N | Long: -122.4194° W | Geofence: 200m</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 6 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 6: Department Hierarchy & Department Heads</span>
        <span class="step-number-badge">admin/departments</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Department Structuring & Management Mapping</h4>
          <p>Creates organizational departments and maps Department Heads to oversee team attendance.</p>
          <ul class="feature-list">
            <li>Create Engineering, Operations, Sales, HR departments.</li>
            <li>Department Head Assignment: Grant managers access to team reports.</li>
            <li>Member Count tracking per department.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/departments</span>
          </div>
          <div class="mockup-content">
            <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #30363d;">
              <div style="color: #fff; font-weight: 700; font-size: 0.8rem;">Engineering Dept (42 Members)</div>
              <div style="color: #8b949e; font-size: 0.7rem;">Head: Sarah Miller</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 7 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 7: Staff Onboarding & Role Assignment</span>
        <span class="step-number-badge">admin/members</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Employee Directory & Access Role Mapping</h4>
          <p>Admins populate employee directory via modal or CSV bulk import, assigning roles and branch/department mappings.</p>
          <ul class="feature-list">
            <li>Add Single Member or Bulk Import via CSV sheet.</li>
            <li>Assign Roles: ORG_ADMIN, BRANCH_MANAGER, DEPT_HEAD, MEMBER.</li>
            <li>Designation, Employee ID, Phone, Branch, and Dept mapping.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/members</span>
          </div>
          <div class="mockup-content">
            <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #30363d;">
              <div style="color: #79c0ff; font-weight: 700;">Alex Johnson (EMP-88492)</div>
              <div style="color: #8b949e; font-size: 0.72rem;">Senior Engineer • Engineering Dept • Role: MEMBER</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 8 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 8: QR Pass & Physical ID Sheet Generation</span>
        <span class="step-number-badge">admin/qr-management</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Dynamic QR Pass & Physical ID Sheet Export</h4>
          <p>Generates encrypted QR tokens for staff, available dynamically in mobile app or as printable ID card sheets.</p>
          <ul class="feature-list">
            <li>Mobile Dynamic Pass: Time-rotating TOTP QR code preventing screenshot sharing.</li>
            <li>Printable ID Cards: Batch export ID card sheets for lanyard badges.</li>
            <li>Admin Reset Password: One-click temp password generation for staff.</li>
            <li>Bulk QR Token Regeneration: Instant token refresh across active staff.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/qr-management</span>
          </div>
          <div class="mockup-content" style="text-align: center;">
            <button style="background: #238636; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 700; font-size: 0.75rem;">
              Print Batch ID Card Sheet (PDF)
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 9 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 9: Kiosk Hardware Station Terminal Setup</span>
        <span class="step-number-badge">apps/kiosk</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Entrance Camera Scanner Terminal</h4>
          <p>Mounted tablets or front-desk computers run the Kiosk application, continuously scanning incoming employee QR codes.</p>
          <ul class="feature-list">
            <li>Sub-second scan processing (&lt;300ms verification latency).</li>
            <li>Instant visual card: Green banner with photo & name for success, Red for invalid/expired.</li>
            <li>Audio chime confirmation for hands-free visual acknowledgment.</li>
            <li>Automatic 3-second auto-reset for seamless queue management.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">kiosk.uniteattendance.com/hq-entrance</span>
          </div>
          <div class="mockup-content">
            <div style="background: rgba(39, 201, 63, 0.15); border: 2px solid #27c93f; border-radius: 12px; padding: 16px; text-align: center;">
              <div style="color: #27c93f; font-weight: 800; font-size: 1rem;">✓ CHECK-IN SUCCESSFUL</div>
              <div style="color: #fff; font-weight: 700; font-size: 1.1rem; margin-top: 4px;">Alex Johnson</div>
              <div style="color: #8b949e; font-size: 0.75rem;">Engineering Dept • 09:04:12 AM (On Time)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 10 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 10: Employee Mobile App Daily Usage</span>
        <span class="step-number-badge">apps/app</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Staff Mobile Self-Service Check-In & Digital Badge</h4>
          <p>Employees use the mobile app for self-service check-in with GPS verification, displaying dynamic QR pass, and reviewing history.</p>
          <ul class="feature-list">
            <li><strong>Home Tab (/):</strong> Active session timer, geofenced GPS check-in/out button, distance to branch indicator.</li>
            <li><strong>My QR Pass Tab (/qr):</strong> Dynamic TOTP QR code pass with live countdown timer.</li>
            <li><strong>History Tab (/history):</strong> Personal monthly attendance log, status badges (Valid, Late, Early Exit).</li>
            <li><strong>Profile Tab (/profile):</strong> Digital ID badge & assigned department/branch details.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">app.uniteattendance.com</span>
          </div>
          <div class="mockup-content">
            <div style="text-align: center; padding: 12px; background: rgba(79, 70, 229, 0.15); border-radius: 12px; border: 1px solid rgba(79, 70, 229, 0.4);">
              <div style="font-size: 0.75rem; color: #a5d6ff;">CURRENT SESSION</div>
              <div style="font-size: 1.5rem; font-weight: 800; color: #fff; font-family: monospace;">04 : 22 : 19</div>
              <div style="color: #7ee787; font-size: 0.72rem; font-weight: 700; margin-top: 4px;">✓ Inside HQ Branch Geofence</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 11 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 11: Real-Time Telemetry & Manual Override</span>
        <span class="step-number-badge">admin/dashboard & admin/attendance</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>WebSocket Stream & Flagged Log Resolution</h4>
          <p>Admins monitor live WebSocket check-in feeds, inspect status flags, and apply manual attendance corrections.</p>
          <ul class="feature-list">
            <li>WebSocket Live Feed displaying live check-in counters & status metrics.</li>
            <li>Status Flags: VALID (Green), INVALID (Red), FLAGGED (Yellow).</li>
            <li>Manual Override: Apply check-in corrections with mandatory admin audit notes.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/attendance</span>
          </div>
          <div class="mockup-content">
            <table style="margin: 0; font-size: 0.72rem;">
              <tr><th>Member</th><th>Time</th><th>Method</th><th>Status</th></tr>
              <tr><td>Alex Johnson</td><td>09:04 AM</td><td>QR_KIOSK</td><td><span style="color: #7ee787;">VALID</span></td></tr>
              <tr><td>Sarah Miller</td><td>09:32 AM</td><td>QR_MOBILE</td><td><span style="color: #ffa657;">FLAGGED (Late)</span></td></tr>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 12 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 12: Analytics & One-Click Payroll Register Export</span>
        <span class="step-number-badge">admin/reports</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Monthly Register Matrix & Payroll Export</h4>
          <p>Admins generate department attendance summaries, monthly registers, and export payroll-ready CSV & PDF files.</p>
          <ul class="feature-list">
            <li>Daily Summary & Monthly Register matrix views.</li>
            <li>Department punctuality breakdown & attendance rate %.</li>
            <li>1-Click Export to CSV spreadsheet & printable PDF register.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/reports</span>
          </div>
          <div class="mockup-content">
            <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #30363d; text-align: center;">
              <div style="color: #7ee787; font-weight: 700; font-size: 0.8rem;">Monthly Register Ready (Aug 2026)</div>
              <div style="color: #8b949e; font-size: 0.7rem; margin-top: 4px;">150 Active Employees • 3,120 Scans Processed</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stage 13 -->
    <div class="step-card">
      <div class="step-header">
        <span style="font-weight: 800; color: #fff;">Stage 13: Super Admin Portal & Tenant Platform Control</span>
        <span class="step-number-badge">admin/super-admin</span>
      </div>
      <div class="step-body">
        <div class="step-info">
          <h4>Platform Tenant Control & Aura AI Anomaly Engine</h4>
          <p>Platform owners manage global organization tenants, subscription plans, AI anomaly engines, and platform audit trails.</p>
          <ul class="feature-list">
            <li><strong>Platform Overview (/super-admin/dashboard):</strong> Global tenant count, subscription status, revenue.</li>
            <li><strong>Organizations (/super-admin/organizations):</strong> Global tenant list, direct plan upgrades/downgrades.</li>
            <li><strong>Aura AI Control (/super-admin/aura):</strong> AI engine configuration & anomaly detection insights.</li>
            <li><strong>Global Audit Logs (/super-admin/audit-logs):</strong> Platform-wide security audit trail.</li>
          </ul>
        </div>
        <div class="mockup-window">
          <div class="mockup-header">
            <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
            <span class="mockup-title">admin.uniteattendance.com/super-admin</span>
          </div>
          <div class="mockup-content">
            <div style="background: #161b22; padding: 10px; border-radius: 8px; border: 1px solid #30363d;">
              <div style="color: #a5d6ff; font-weight: 700;">Super Admin Portal Mode</div>
              <div style="color: #8b949e; font-size: 0.72rem;">Managing 42 Active Organization Tenants</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 4: OFFICIAL PRICING PACKS -->
    <div class="section-header">
      <div>
        <div class="section-num">Section 04</div>
        <h2 class="section-title">Official Subscription Packs & Pricing Structure</h2>
      </div>
      <span style="color: var(--text-muted); font-weight: 600;">Flat 25% Launch Offer</span>
    </div>

    <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 16px;">
      Unite Attendance offers transparent, pack-based pricing tailored to your active employee count. All plans include a <strong>14-Day Free Trial</strong> with no credit card required.
    </p>

    <table>
      <thead>
        <tr>
          <th>Pricing Pack Name</th>
          <th>Employee Range</th>
          <th>Regular Price</th>
          <th>Launch Price (25% OFF)</th>
          <th>Effective Rate</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Starter 10 Pack</strong></td>
          <td>Up to 10 Employees</td>
          <td><span class="regular-price">₹499/mo</span></td>
          <td><span class="price-highlight">₹375 / month</span></td>
          <td>₹37.50 / employee</td>
        </tr>
        <tr>
          <td><strong>Starter 25 Pack</strong></td>
          <td>11 – 25 Employees</td>
          <td><span class="regular-price">₹999/mo</span></td>
          <td><span class="price-highlight">₹749 / month</span></td>
          <td>₹30.00 / employee</td>
        </tr>
        <tr>
          <td><strong>Business 50 Pack</strong></td>
          <td>26 – 50 Employees</td>
          <td><span class="regular-price">₹1,499/mo</span></td>
          <td><span class="price-highlight">₹1,125 / month</span></td>
          <td>₹22.50 / employee</td>
        </tr>
        <tr style="background: rgba(99, 102, 241, 0.15); border: 2px solid rgba(99, 102, 241, 0.4);">
          <td><strong>Pro Growth 100 Pack ★ (POPULAR)</strong></td>
          <td>51 – 100 Employees</td>
          <td><span class="regular-price">₹2,499/mo</span></td>
          <td><span class="price-highlight">₹1,875 / month</span></td>
          <td>₹18.75 / employee</td>
        </tr>
        <tr>
          <td><strong>Scale 200 Pack</strong></td>
          <td>101 – 200 Employees</td>
          <td><span class="regular-price">₹3,999/mo</span></td>
          <td><span class="price-highlight">₹2,999 / month</span></td>
          <td>₹15.00 / employee</td>
        </tr>
        <tr>
          <td><strong>Corporate 500 Pack</strong></td>
          <td>201 – 500 Employees</td>
          <td><span class="regular-price">₹6,999/mo</span></td>
          <td><span class="price-highlight">₹5,249 / month</span></td>
          <td>₹10.50 / employee</td>
        </tr>
        <tr>
          <td><strong>Enterprise 1000 Pack</strong></td>
          <td>501 – 1,000 Employees</td>
          <td><span class="regular-price">₹11,999/mo</span></td>
          <td><span class="price-highlight">₹8,999 / month</span></td>
          <td>₹9.00 / employee</td>
        </tr>
        <tr>
          <td><strong>Large Enterprise</strong></td>
          <td>1,001+ Employees</td>
          <td colspan="3"><strong>Custom Quote / Sales Contact</strong> (Dedicated SLA & Multi-city deployment)</td>
        </tr>
      </tbody>
    </table>

    <!-- Features Included Free in Every Plan -->
    <div class="card" style="margin-top: 24px;">
      <h4 style="color: #fff; font-size: 1.1rem; font-weight: 800; margin-bottom: 16px;">Included Free in Every Subscription Plan</h4>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 12px;">
        <div style="color: var(--text-muted); font-size: 0.85rem;">✓ Multi-Branch & Dept Support</div>
        <div style="color: var(--text-muted); font-size: 0.85rem;">✓ Dynamic TOTP Pass Scanning</div>
        <div style="color: var(--text-muted); font-size: 0.85rem;">✓ Role-Based Manager Access</div>
        <div style="color: var(--text-muted); font-size: 0.85rem;">✓ Shift & Grace Period Rules</div>
        <div style="color: var(--text-muted); font-size: 0.85rem;">✓ 1-Click PDF & CSV Exports</div>
        <div style="color: var(--text-muted); font-size: 0.85rem;">✓ 100% Cloud Access (No PC App)</div>
        <div style="color: var(--text-muted); font-size: 0.85rem;">✓ Mobile App & Kiosk Web PWA</div>
        <div style="color: var(--text-muted); font-size: 0.85rem;">✓ Audit Log & Security Trail</div>
      </div>
    </div>

    <!-- Footer Summary -->
    <div style="text-align: center; margin-top: 60px; padding-top: 24px; border-top: 1px solid var(--border); color: var(--text-muted); font-size: 0.85rem;">
      <p>© 2026 Unite Attendance Platform. All rights reserved.</p>
      <p style="margin-top: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem;">Official Comprehensive Client Product Manual & Lifecycle Specification • Document Version 6.0</p>
    </div>

  </div>

</body>
</html>
`;

const htmlFilePath = path.join(rootDir, 'Unite_Attendance_Product_Guide.html');
fs.writeFileSync(htmlFilePath, htmlContent, 'utf-8');
console.log('✓ Generated Ultimate HTML Product Guide at:', htmlFilePath);

// Now run msedge in headless mode to render to PDF
const pdfFilePath = path.join(rootDir, 'Unite_Attendance_Product_Guide.pdf');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

try {
  console.log('Rendering PDF via Headless Edge...');
  const cmd = `"${edgePath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfFilePath}" "${htmlFilePath}"`;
  execSync(cmd);
  console.log('✓ Successfully generated Ultimate PDF Product Guide at:', pdfFilePath);
} catch (err) {
  console.error('Error rendering PDF with Edge:', err);
}
