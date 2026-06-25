# Takeoff

> **Premium Construction Estimating & PDF Takeoff Software**
> 
> 🌐 Website: [ptakeoff.com](https://ptakeoff.com) | 📥 [Download 30-day Free Trial](https://ptakeoff.com/download/latest)

Takeoff (technical identifier: `poitakeoff`, developed under the `PQuant` brand) is a high-performance, offline-first desktop application designed for blueprint quantity takeoff, recipe-driven estimation, and dynamic project planning. 

Engineered from the ground up for construction estimators, civil engineers, and infrastructure contractors, Takeoff delivers a modern desktop experience that combines pixel-perfect blueprint measurement with a powerful, flexible recipe calculation engine, built-in Gantt scheduling, and next-generation AI integrations.

---

## 🚀 Key Advantages

* **🔒 100% Offline & Private:** All drawings, databases, and project configurations reside on your local machine. No cloud dependencies, no latency, and complete security for your proprietary bidding data.
* **📦 Single-File Portability (`.ptko`):** Projects are saved as self-contained ZIP archives containing the SQLite database and all imported PDF files. Share projects instantly, sync over OneDrive/Dropbox without collision issues, and manage revisions cleanly.
* **📊 Dynamic Excel Exports (Live Formulas):** Export estimates to production-ready Microsoft Excel sheets (`.xlsx`). Takeoff exports actual formulas (e.g., `=D4*E4` and `SUM` functions) rather than flat static numbers, keeping your spreadsheets fully auditable and interactive.
* **⚡ Lazy Rendering & Spatial Snapping:** Work with massive multi-page blueprints smoothly. PDFs are rasterized on demand, keeping memory usage low, while drawing vertices snap instantly to neighboring geometries using a background spatial grid index.

---

## 🎨 Features & Capabilities

### 📐 Multi-Mode Scale Calibration
Never get bottlenecked by drawing variations. Takeoff supports multiple calibration modes per viewport:
* **Known Distance:** Click two points on the blueprint (e.g., a known wall or scale bar) and input the physical length.
* **Nominal Scale:** Type in standard ratios (e.g., `1:500`, `1:1000`). The engine automatically translates pixels to meters/feet using the drawing's render DPI.
* **Anisotropic XY Scaling:** Calibrate horizontal (X) and vertical (Y) axes independently. Ideal for civil engineering profile drawings where vertical exaggeration is used.

### 🖌️ Vector-Based Measurement Canvas
* **Interactive Tools:** Measure lengths, multi-segment polylines, closed polygon areas, rectangles, and counts.
* **Pixel-Sacred Coordinates:** Geometry is stored in raw pixels. If you adjust the scale calibration later, all calculated physical quantities update instantly without warping or recreating your shapes.
* **Vertex Editing & Snapping:** Drag, modify, or insert vertices. Click to split a line segment. Enable vector snapping to align points perfectly to nearby measurements.

### 📝 Integrated PDF Text Search
Find notes, labels, or structures on the blueprint immediately. A background extractor extracts text directly from the PDF vector layers, mapping them to coordinates on the canvas so you can search and auto-zoom to text matches.

### 🧪 Advanced Recipe & Assembly Costing
Scale your pricing from raw materials to composite assemblies:
* **Resource Library:** Define baseline unit rates for labor, materials, machinery, and subcontracts.
* **Recipe Engine:** Bind multiple resources into formulas. Account for waste coefficients, compaction factors, loose volume vs. compact volume, and soil density conversions (e.g., $m^3_{\text{ktr}} \rightarrow m^3_{\text{rtr}} \rightarrow \text{tn}$).
* **Cascading Markups:** Set margins on three levels: project-wide defaults, specific work categories (e.g., INFRA 2015 Littera classification), or individual line items. Calculate overhead, profit margin, and VAT automatically.

### 📅 Gantt Scheduling & Project Timeline [New]
* **Built-in Gantt Charts:** Plan your project phases visually inside the tool.
* **Shift & Calendar Rules:** Define custom workdays, active shifts, and workweek patterns.
* **Real-time Tracking:** Follow task durations, start/end dates, and milestones as the estimate is built.

### 💰 Payment Milestones & Schedules [New]
* **Payment Milestone Planner:** Divide your project estimate into clear, structured payment milestones.
* **Automated Payments:** Automatically generate and track payment tables based on work progress, recipe items, or custom milestones.

### ☁️ Cloud Sync & Team Collaboration [New]
* **Sync-Ready File Format:** The `.ptko` project file format is designed to be easily syncable via OneDrive, Dropbox, or other shared drives.
* **Estimator Tracking & Audit Logs:** Assign a responsible estimator and reviewer to the project. The app maintains a secure record of who made or modified measurements and when.
* **Project Dashboard:** A landing home inside each project featuring a shared team noticeboard, an automated safety/quality checklist, and a dedicated risk register for soil, contract, and bidding risks.

### 🔌 AI-Ready — Native Model Context Protocol (MCP) [New]
Takeoff is equipped with a native MCP server (`@pquant/takeoff-mcp-server`). You can connect it directly to your favorite AI assistant (such as Cursor, Cline, or Claude Desktop). 
The AI can:
* Read sewer manholes or measurements directly from PDF blueprints and input them into takeoff tables.
* Design complex cost recipes (e.g., for pipe trenches) based on soil reports.
* Perform risk assessments by scanning project files and comparing them against historical data.
* *Note: You only pay your own AI API costs directly to your provider — we charge no transaction fees for using MCP.*

### 📏 Flexible Units & Decimals [New]
* Fully supports both **Metric** and **Imperial** systems (inches, feet, yards, square feet, cubic yards).
* Customize decimal precision, measurement preferences, and display units dynamically on the fly.

---

## 📁 Infrastructure Calculation Presets (Finland / Infra 2015)

This repository includes pre-built, localized estimation resources for Finnish infrastructure work. They are located in the [**`/json`**](./json) folder and can be downloaded and imported directly into the application:

* [**`Infra2015_reseptikirjasto.json`**](./json/Infra2015_reseptikirjasto.json) & [**`Infra2015_reseptit.json`**](./json/Infra2015_reseptit.json): Complete structural and earthwork recipe templates mapped to standard Finnish classification codes.
* [**`Infra2015_resurssit.json`**](./json/Infra2015_resurssit.json): Standard unit costs for labor, machinery, backfill materials, and pipe structures.
* [**`Infra2015_tarjousrivit.json`**](./json/Infra2015_tarjousrivit.json): Preformatted estimation template structures for rapid pricing.

*To import these, open Takeoff, navigate to **Settings / Project Settings**, and choose **Import Resource Library / Import Recipe Library**.*

---

## ⚖️ Licensing (The Fair Play Deal)

We believe in software ownership. No endless subscription loops, no hidden pricing.
* **30-Day Free Trial:** Try every single feature out-of-the-box. No registration, no email, and no credit card required.
* **One-Time Purchase:** Buy a Pro license for **€250 (VAT 0%)** and own it forever.
* **Free License Resale/Transfer:** If you retire, change careers, or no longer need the software, you can deactivate your license key inside the application settings and hand the key to a colleague or buyer. We charge no transfer fees and enforce no vendor lock-in.

---
© 2026 PQuant. All rights reserved. Registered website: [ptakeoff.com](https://ptakeoff.com)
