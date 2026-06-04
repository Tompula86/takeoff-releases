# PQuant 2026

> **Premium Construction Estimating & PDF Takeoff Software**
> A high-performance, offline-first desktop application designed for blueprint quantity takeoff, recipe-driven estimation, and dynamic pricing.

## 🚀 Why PQuant?

PQuant (technical identifier: `poitakeoff`) is engineered from the ground up for construction estimators, civil engineers, and infrastructure contractors. Unlike slow, web-based tools or rigid legacy software, PQuant delivers a modern desktop experience that combines pixel-perfect blueprint measurement with a powerful, flexible recipe calculation engine.

* **🔒 100% Offline & Private:** All drawings, databases, and project configurations reside on your local machine. No cloud dependencies, no latency, and complete security for your proprietary bidding data.
* **📦 Single-File Portability (`.ptko`):** Projects are saved as self-contained ZIP archives containing the SQLite database and all imported PDF files. Share projects instantly, sync over OneDrive/Dropbox without collision issues, and manage revisions cleanly.
* **📊 Dynamic Excel Exports (Live Formulas):** Export estimates to production-ready Microsoft Excel sheets (`.xlsx`). PQuant exports actual formulas (e.g., `=D4*E4` and `SUM` functions) rather than flat static numbers, keeping your exported spreadsheets fully auditable and interactive.
* **⚡ Lazy Rendering & Spatial Snapping:** Work with massive multi-page blueprints smoothly. PDFs are rasterized on demand, keeping memory usage low, while drawing vertices snap instantly to neighboring geometries using a background spatial grid index.

---

## 🎨 Key Features

### 📐 Multi-Mode Scale Calibration

Never get bottlenecked by drawing variations. PQuant supports multiple calibration modes per viewport:

* **Known Distance:** Click two points on the blueprint (e.g., a known wall or scale bar) and input the physical length.
* **Nominal Scale:** Type in standard ratios (e.g., `1:500`, `1:1000`). The engine automatically translates pixels to meters using the drawing's render DPI.
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
* **Recipe Engine:** Bind multiple resources into formulas. Account for waste coefficients, compaction factors, loose volume vs. compact volume, and soil density conversions (e.g., $m^3_{ktr} \rightarrow m^3_{rtr} \rightarrow tn$).
* **Cascading Markups:** Set margins on three levels: project-wide defaults, specific work categories (INFRA 2015 Littera classification), or individual line items. Calculate overhead, profit margin, and VAT automatically.

---

## 📁 Infrastructure Calculation Presets (Finland / Infra 2015)

This repository includes pre-built, localized estimation resources for Finnish infrastructure work. They are located in the [**`/json`**](./json) folder and can be downloaded and imported directly into the application:

* [**`Infra2015_reseptikirjasto.json`**](./json/Infra2015_reseptikirjasto.json) & [**`Infra2015_reseptit.json`**](./json/Infra2015_reseptit.json): Complete structural and earthwork recipe templates mapped to standard Finnish classification codes.
* [**`Infra2015_resurssit.json`**](./json/Infra2015_resurssit.json): Standard unit costs for labor, machinery, backfill materials, and pipe structures.
* [**`Infra2015_tarjousrivit.json`**](./json/Infra2015_tarjousrivit.json): Preformatted estimation template structures for rapid pricing.

*To import these, open PQuant, navigate to **Settings / Project Settings**, and choose **Import Resource Library / Import Recipe Library**.*

---
