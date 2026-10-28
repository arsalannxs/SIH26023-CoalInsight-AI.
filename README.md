# CoalInsight AI
> *From Mining Documents to Decision-Ready Insights.*

---

## 1. Metadata & SIH26023 Problem Statement
- **Problem ID:** SIH26023
- **Title:** AI-Powered Geological, Mining and other Reporting Solution for CMPDI/CIL subsidiaries
- **Organisation:** Ministry of Coal, Government of India
- **Department:** Coal India Limited (CIL) & Central Mine Planning and Design Institute (CMPDI)
- **Category:** Software
- **Theme:** Smart Automation

---

## 2. Problem Overview
Mining and geological teams across Coal India Limited (CIL) and its subsidiaries (CMPDI, SECL, MCL, BCCL, CCL, ECL, WCL, NCL, NEC) must routinely compile, cross-examine, and report geological parameters, borehole exploration logs, overburden stripping returns, and production statistics. These records originate from diverse, heterogeneous sources:
- Scanned historical PDFs and drill core appraisal logs.
- Digital statutory bulletins and annual production filings.
- Spreadsheets (XLSX, CSV) containing proximate coal quality analyses and heavy earth-moving machinery logs.
- Written replies to administrative and parliamentary queries (e.g. Lok Sabha & Rajya Sabha USQs).

**Core Challenges in Existing Workflows:**
1. **Manual Compilation Latency:** Compiling multi-subsidiary figures across years is slow and labor-intensive.
2. **Inconsistent Data & Conflicting Returns:** Figures often differ between provisional divisional returns and audited annual accounts without explicit flags.
3. **Lack of Traceability:** Traditional summaries rarely provide instant, clickable passage-level citations to physical page numbers or borehole trays.
4. **Unverifiable AI Hallucinations:** Generic LLMs invent numbers or quote non-existent pages, creating severe statutory risks for administrative and parliamentary reporting.

---

## 3. Proposed Solution: CoalInsight AI
**CoalInsight AI** is an enterprise-grade document intelligence, verification, and statutory reporting platform engineered specifically for the mining sector. It bridges raw historical records and formal decision-making through:
- An automated **9-stage document ingestion pipeline** with digital font stream decoding and OCR preprocessing.
- **Evidence-grounded structured parameter extraction** (coal output, stripping ratios, seam thicknesses, ash percentages, and proved reserves).
- An **audit-tracked human verification interface** where every correction retains the original extracted value, reviewer identity, timestamp, and mandatory statutory reason.
- A **multi-source conflict detection engine** that identifies contradictory figures (e.g. 50.0 MT vs 52.5 MT for Gevra OC) and presents them side-by-side with citations.
- An **AI Research Assistant** powered by `@google/genai` (Gemini 3.8 Flash) with a local deterministic fallback engine when offline or unconfigured.
- **Statistical Topic Exploration** using n-gram phrase mining and interactive frequency-weighted word clouds.
- A **guided 3-step statutory report builder** capable of producing technical drafts, parliamentary replies, and print-ready PDF exports with full evidence bibliographies.

---

## 4. Main Features

| Feature Module | Capabilities |
| :--- | :--- |
| **Operational Overview** | Real application KPIs (documents, processed count, verified parameters, active discrepancies, pending reviews), recent activity feed, and frequency highlights. |
| **Document Library** | Searchable grid and list views with multi-criteria filtering (Subsidiary, Document Type, Status), tag indexing, and deep document inspector modal. |
| **9-Stage Upload Pipeline** | Multi-format dropzone (PDF, Scanned PDF, XLSX, CSV, DOCX) with live stage-by-stage pipeline tracking (validation, text extraction, OCR, table parsing, normalisation, duplicate checking, passage indexing, anomaly flagging, reviewer dispatch). |
| **Structured Field Verification** | Granular field review (Accept, Edit with mandatory audit reason, Reject, Add Manual Parameter). Full traceability to supporting document passages. |
| **Conflict & Inconsistency Matrix** | Automatic side-by-side comparison of contradictory numbers across subsidiary filings with severity classification. |
| **AI Research Assistant** | Chat interface grounded exclusively in authorized records. Returns structured answers with clickable citations (`[Document Title, Page X]`). Explicitly declares missing evidence when records are insufficient. |
| **Topic Explorer & Word Cloud** | Frequency-weighted linguistic analysis with stop-word removal and n-gram phrase extraction (`overburden removal`, `seam thickness`, `stripping ratio`). Clicking a topic filters related passages. |
| **Mining Analytics** | Recharts visualisations for production trends, target vs actuals, stripping ratios ($m^3/t$), and UNFC reserve categories. Includes toggle to exclude unverified figures. |
| **Automated Report Builder** | 3-step guided wizard (Framework $\to$ Data Selection $\to$ Editable Draft). Live markdown editor, side-by-side preview, print stylesheet, and file exports (.md, .doc). |
| **Review & Approvals** | Multi-status lifecycle (`Draft`, `Needs Review`, `Changes Requested`, `Reviewed`, `Approved`, `Archived`) with digital signatures and audit histories. |
| **Immutable Audit History** | Chronological audit log of all system actions (uploads, corrections, queries, approvals) with CSV export. |
| **Platform Settings** | OCR confidence thresholds, conflict tolerance sliders, CIL subsidiary routing, and one-click demo data reset. |

---

## 5. User Roles and Workflows

```
  [Geological Researcher] ───> Uploads core drilling logs & borehole strata (PDF/XLSX)
                                       │
                                       ▼
  [Data Analyst / Reviewer] ──> Verifies extracted parameters & resolves conflicts
                                       │
                                       ▼
  [Reporting Officer] ────────> Asks research questions & builds statutory report
                                       │
                                       ▼
  [Chief Reviewer / DDG] ─────> Conducts technical sign-off & formal approval
```

1. **Geological Researchers & Mining Engineers:** Ingest borehole logs and production returns; inspect extracted tables and stratigraphic cross-sections.
2. **Document Reviewers & Data Analysts:** Cross-examine extracted figures against source pages; adjust misread numbers with permanent audit justifications.
3. **Reporting Officers:** Formulate answers to parliamentary and administrative queries using grounded evidence; assemble multi-section draft reports.
4. **Authorized Administrators & Chief Reviewers:** Review report drafts; grant formal statutory sign-offs with digital stamps or request technical revisions.

---

## 6. System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                         CLIENT (React 19 + TypeScript + Vite)          │
│  ┌───────────────┐ ┌────────────────┐ ┌────────────────┐ ┌───────────┐ │
│  │   Overview    │ │Document Library│ │ Extracted Data │ │ Analytics │ │
│  └───────┬───────┘ └───────┬────────┘ └───────┬────────┘ └─────┬─────┘ │
│  ┌───────┴───────┐ ┌───────┴────────┐ ┌───────┴────────┐ ┌─────┴─────┐ │
│  │  AI Assistant │ │ Topic Explorer │ │ Report Builder │ │ Approvals │ │
│  └───────┬───────┘ └────────────────┘ └───────┬────────┘ └───────────┘ │
│          │                                    │                        │
│          ▼                                    ▼                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │     Application Context (State, Cache, & Deterministic Grounder) │  │
│  └───────────────────────────────┬──────────────────────────────────┘  │
└──────────────────────────────────┼─────────────────────────────────────┘
                                   │ HTTP (JSON Proxy)
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FULL-STACK BACKEND (Express / Node.js)          │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────┐  │
│  │   GET /api/health       │  │ POST /api/gemini/research           │  │
│  └─────────────────────────┘  └──────────────────┬──────────────────┘  │
│  ┌─────────────────────────┐                     │                     │
│  │ POST /api/gemini/report │                     ▼                     │
│  └───────────┬─────────────┘      ┌──────────────────────────────┐     │
│              │                    │ Google GenAI SDK             │     │
│              ▼                    │ (gemini-3.8-flash)           │     │
│  ┌─────────────────────────────┐  │ Server-Side Only / Secure    │     │
│  │ Deterministic Fallback      │  └──────────────┬───────────────┘     │
│  │ Grounded Synthesis Engine   │                 │                     │
│  └─────────────────────────────┘                 ▼                     │
│                                           Google Gemini API            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Technology Stack

- **Frontend Framework:** React 19 (`react`, `react-dom`) with TypeScript.
- **Build System:** Vite 8 with `@vitejs/plugin-react` and `@tailwindcss/vite`.
- **Styling & Design System:** Tailwind CSS v4 with custom statutory palette (Midnight Navy `#17263C`, Copper `#C47A43`, Teal `#278A85`, Mist `#F3F6F8`, Slate `#435164`).
- **Icons:** Lucide React (`lucide-react`).
- **Data Visualisation:** Recharts (`recharts`) for multi-series bar, line, and pie charts.
- **Animation & Transitions:** Motion (`motion`).
- **Backend Server:** Express 4.21 with Node.js (`tsx` runtime).
- **AI Intelligence SDK:** `@google/genai` (Server-side Gemini 3.8 Flash) with zero client exposure.
- **Environment Management:** `dotenv`.

---

## 8. Actual Project Folder Structure

```
├── .env.example                         # Environment configuration template
├── .gitignore                            # Repository ignore rules
├── index.html                           # Single page HTML entry point & font links
├── metadata.json                        # Applet metadata & server-side Gemini capability
├── package.json                         # Scripts and dependencies
├── server.ts                            # Full-stack Express server & Gemini endpoints
├── tsconfig.json                        # TypeScript strict compiler configuration
├── vite.config.ts                       # Vite bundler configuration
└── src/
    ├── App.tsx                          # Root container with navigation & modal routing
    ├── main.tsx                         # React 19 DOM bootstrap
    ├── index.css                        # Tailwind v4 theme variables & print layout
    ├── assets/
    │   └── images/
    │       ├── coal_opencast_mine_*.jpg # Aerial opencast mine operations
    │       ├── coal_geological_strata_*.jpg # Technical strata cross-section
    │       └── coal_borehole_core_*.jpg # Drill core sample trays
    ├── context/
    │   └── AppContext.tsx               # Global state provider & persistence
    ├── data/
    │   └── demoData.ts                  # Synthetic CMPDI/CIL demo documents & parameters
    ├── types/
    │   └── index.ts                     # TypeScript data model definitions
    ├── utils/
    │   └── textProcessing.ts            # N-gram phrase miner & word cloud generator
    └── components/
        ├── layout/
        │   ├── Header.tsx               # Top Bar Contract, subsidiary filter & demo loader
        │   └── Sidebar.tsx              # 11-item navigation sidebar with active badges
        ├── modals/
        │   ├── DocumentModal.tsx        # Deep inspector (passages, tables, metadata)
        │   ├── ValueCorrectionModal.tsx # Audited field editor with mandatory reason
        │   └── AddRecordModal.tsx       # Manual parameter insertion form
        └── views/
            ├── OverviewView.tsx         # Executive dashboard & real metrics
            ├── DocumentLibraryView.tsx  # Searchable grid/list library
            ├── UploadProcessView.tsx    # 9-stage pipeline & dropzone
            ├── ExtractedDataView.tsx    # Field-level verification & conflict matrix
            ├── ResearchAssistantView.tsx# Grounded chat with clickable citations
            ├── TopicExplorerView.tsx    # Frequency word cloud & linked passages
            ├── MiningAnalyticsView.tsx  # Production, stripping & reserve charts
            ├── ReportBuilderView.tsx    # 3-step wizard with print/PDF export
            ├── ReviewApprovalsView.tsx  # Statutory sign-off & review workflow
            ├── ActivityHistoryView.tsx  # Immutable audit log with CSV export
            └── SettingsView.tsx         # OCR thresholds, diagnostics & reset
```

---

## 9. Document Ingestion and OCR Pipeline

The ingestion pipeline executes nine sequential stages:
1. **Validation:** Checks MIME types (PDF, XLSX, CSV, DOCX) and file size constraints ($\le 50\text{MB}$).
2. **Text Extraction:** Ingests digital character streams with coordinate preservation.
3. **OCR Preprocessing:** Simulates binarization, skew correction, and OCR recognition for scanned historical maps and core logs.
4. **Table Matrix Parsing:** Identifies multi-column tabular boundaries, header hierarchies, and numeric values.
5. **Data Normalisation:** Standardises units (converting Lakh Tonnes to Million Tonnes, stripping ratios to $m^3/t$, and dates to standard fiscal notation).
6. **Duplicate Check:** Computes document content hashes to avoid redundant subsidiary filings.
7. **Passage Segmentation:** Chunks content into traceable passages indexed by specific page numbers.
8. **Inconsistency Flagging:** Evaluates numbers against predefined statutory tolerance rules ($\pm 5\%$).
9. **Review Queue Dispatch:** Pushes flagged parameters to human reviewer queues.

---

## 10. Structured Extraction and Validation

Extracted metrics are stored with comprehensive audit metadata:
- **Field Name:** e.g., `Proved Coal Reserves (Gevra-Dipka Expansion)`
- **Extracted Value & Unit:** e.g., `1,420.50 Million Tonnes (MT)`
- **Original Value:** Preserved permanently when modified.
- **Source Document & Page:** e.g., `DOC-CMPDI-2024-01`, Page 18.
- **Extraction Method:** `Digital Text Parser`, `OCR Engine v2`, `Table Matrix Parser`, or `Manual Entry`.
- **Confidence Score:** Derived from OCR engine metrics or deterministic lexical match rates.
- **Supporting Passage:** Exact quote from the source document.
- **Audit Reason:** Mandatory explanation required when any reviewer edits a value.

---

## 11. Search and AI Question-Answering Architecture

1. **Authorization & Subsidiary Scoping:** The query is filtered by the user's active subsidiary selection (`CMPDI`, `SECL`, `MCL`, `BCCL`, `CCL`, or `ALL`).
2. **Passage Retrieval:** Relevant passages are retrieved using deterministic token-frequency scoring and multi-word phrase matching.
3. **Prompt Construction:** The server packages the top scored passages into a grounded context prompt.
4. **Grounded Generation (Server-Side):**
   - If `GEMINI_API_KEY` is configured, calls `gemini-3.8-flash` via the `@google/genai` SDK with strict evidence-only instructions.
   - If the API key is not present or offline, the local deterministic grounding engine formats the exact cited passages.
5. **Traceability Guarantee:** Every statement cites the source document and page number. If no matching records exist, the assistant explicitly states: *"Insufficient evidence found in the uploaded document records."*

---

## 12. API Documentation for Implemented Endpoints

### `GET /api/health`
- **Description:** System health check and engine readiness diagnostic.
- **Response:**
  ```json
  {
    "status": "ok",
    "app": "CoalInsight AI",
    "sihCode": "SIH26023",
    "geminiConfigured": true,
    "timestamp": "2026-10-28T18:25:00.000Z"
  }
  ```

### `POST /api/gemini/research`
- **Description:** Evidence-grounded document research and question answering.
- **Request Body:**
  ```json
  {
    "query": "Summarise coal production figures for FY 2023-24",
    "documents": [...],
    "focusSubsidiary": "SECL"
  }
  ```
- **Response:**
  ```json
  {
    "answer": "During FY 2023-24, Gevra Opencast Project achieved record raw coal extraction of 52.50 MT... [SECL Bulletin, p. 2]",
    "engine": "Gemini 3.8 Flash (Server Grounded)",
    "grounded": true,
    "sources": [
      {
        "docTitle": "SECL Annual Opencast Mining Production Bulletin",
        "page": 2,
        "text": "..."
      }
    ]
  }
  ```

### `POST /api/gemini/report`
- **Description:** Synthesizes a structured statutory report draft from verified records.
- **Request Body:**
  ```json
  {
    "reportType": "Geological Summary",
    "title": "Korba Basin Geological Review",
    "period": "FY 2023-24",
    "subsidiary": "CMPDI",
    "selectedDocs": [...],
    "verifiedRecords": [...],
    "sections": ["Executive Summary", "Key Findings", "Citations"]
  }
  ```

---

## 13. Prerequisites & Running the Application

### Prerequisites
- Node.js $\ge 18.0.0$
- npm $\ge 9.0.0$

### Environment Variables (`.env`)
```bash
# GEMINI_API_KEY: Optional. If omitted, the platform seamlessly uses
# its local deterministic grounding engine with zero broken features.
GEMINI_API_KEY="your-gemini-api-key-here"

# PORT: Server listening port (defaults to 3000)
PORT=3000
```

### Installation & Run Commands
```bash
# 1. Install all dependencies
npm install

# 2. Run typecheck & lint verification
npm run lint

# 3. Build production bundle
npm run build

# 4. Start the full-stack application (Express + Vite)
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 14. Required Three-Minute Demo Walkthrough

Follow these steps for a complete evaluation:
1. **Explore the Overview Dashboard:** Review live KPIs (documents, processed records, active cross-document contradictions).
2. **Inspect the Document Library:** Open `CMPDI Regional Exploration Report`. Click **Inspect** to examine extracted passages, Table 3.2 (Upper Kusmunda seam thickness 28.4m), and copy a statutory citation.
3. **Execute Document Ingestion:** Navigate to **Upload & Process**. Click the **SECL Bulletin** demo preset and press **Process Document**. Observe the live 9-stage pipeline progression.
4. **Audit & Correct an Extracted Value:** Go to **Extracted Data**. Locate `Gevra OC Raw Coal Extraction FY24` (flagged due to conflict with Parliamentary USQ 2481). Click the pencil edit icon, update the value from 50.00 MT to 52.50 MT, provide the mandatory reason (`Reconciled against final audited dispatch returns`), and save. Note the instant audit record created.
5. **Resolve a Cross-Document Contradiction:** Switch to the **Cross-Doc Discrepancies** tab and inspect the side-by-side comparison of SECL vs Ministry filings. Click **Mark Reconciled**.
6. **Query the AI Research Assistant:** In **AI Research Assistant**, click the prompt: *"Compare the reported Gevra OC production figures between SECL and Ministry filings."* Observe the grounded response with citations. Click a citation to jump directly to the source page.
7. **Analyze Mining Topics:** In **Topic Explorer**, click the word cloud tag `Overburden Removal`. See matching documents and excerpted passages update automatically.
8. **Inspect Analytical Visualizations:** In **Mining Analytics**, inspect the *Subsidiary Raw Coal Production vs Target* chart and toggle **Exclude Unverified Extracted Values**.
9. **Synthesize a Statutory Report:** In **Report Builder**, select *Geological Summary*, pick 3 grounding documents, and click **Synthesize Report Draft**. Edit the draft in markdown, click **Print / Save PDF**, and export as `.doc`.
10. **Execute Statutory Approval:** In **Review & Approvals**, add reviewer notes and click **Approve & Sign-Off**.
11. **Review Audit Trail:** Open **Activity History** to verify that every action taken during the demo has an immutable chronological record. Export as CSV.

---

## 15. Security, Privacy & Integrity Considerations
- **No Client Secrets:** All external AI API calls are routed through server-side Express endpoints; `process.env.GEMINI_API_KEY` is never bundled or sent to the browser.
- **Documents as Data:** Uploaded document contents are parsed and sanitized as structured data; they are never executed as prompt instructions.
- **Immutable Audit Logging:** Changes to quantitative parameters require reviewer signatures and reasons, preventing silent data manipulation.
- **Statutory Disclaimers:** Every generated draft is explicitly labeled `DRAFT FOR TECHNICAL REVIEW` until formally signed off by a human Competent Person.

---

## 16. Known Limitations & Future Scope
- **Known Limitations:**
  - Full-resolution OCR on 500+ page raster scans relies on simulated preprocessing in the browser prototype.
  - Multi-user authentication utilizes simulated reviewer roles (`Dr. S. K. Mukherjee`, `Er. V. K. Sharma`) rather than an external LDAP / Single Sign-On provider.
- **Future Scope:**
  - Direct integration with Coal India's SAP ERP and Coal Mine Surveillance & Management System (CMSMS).
  - Native spatial GIS map layers displaying borehole collars and GPS coordinates on Coal India lease boundary maps.
  - Automated UNFC / JORC reserve classification compliance certificates.

---

## 17. License
Developed for the **Smart India Hackathon (SIH26023)** under the Ministry of Coal, Coal India Limited, and CMPDI technical specifications. Distributed under the Apache-2.0 License.
