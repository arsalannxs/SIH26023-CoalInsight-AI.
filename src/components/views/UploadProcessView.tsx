import React, { useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Building2, 
  Sparkles,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Subsidiary, DocumentType, DocumentCategory, MiningDocument } from '../../types';

interface PipelineStage {
  id: number;
  name: string;
  desc: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

const DEFAULT_STAGES: PipelineStage[] = [
  { id: 1, name: 'File Validation & MIME Verification', desc: 'Validating PDF/Spreadsheet binary signature and checksum integrity.', status: 'pending' },
  { id: 2, name: 'Digital Text & Font Stream Extraction', desc: 'Decoding embedded digital typography and vector glyph coordinates.', status: 'pending' },
  { id: 3, name: 'Scanned Page OCR Preprocessing', desc: 'Applying binarization, skew correction and optical character recognition.', status: 'pending' },
  { id: 4, name: 'Table Matrix & Boundary Extraction', desc: 'Identifying cell grids, header hierarchies, and numeric column matrices.', status: 'pending' },
  { id: 5, name: 'Unit & Numeric Value Normalisation', desc: 'Normalizing MT, Lakh Tonnes, stripping ratios (m³/t), and fiscal dates.', status: 'pending' },
  { id: 6, name: 'Duplicate Record & Hash Matching', desc: 'Checking repository against existing CIL subsidiary filings.', status: 'pending' },
  { id: 7, name: 'Page Index & Passage Segmentation', desc: 'Creating traceable passage references with exact page numbers.', status: 'pending' },
  { id: 8, name: 'Data Anomaly & Inconsistency Flagging', desc: 'Auditing values against statutory thresholds and conflicting returns.', status: 'pending' },
  { id: 9, name: 'Reviewer Dispatch & Index Commit', desc: 'Committing verified passages to searchable index and reviewer queue.', status: 'pending' },
];

export const UploadProcessView: React.FC = () => {
  const { addDocument, setActiveSection, setSelectedDocForView } = useApp();

  const [title, setTitle] = useState('');
  const [sourceOrg, setSourceOrg] = useState<Subsidiary>('SECL');
  const [documentType, setDocumentType] = useState<DocumentType>('Mining Production Bulletin');
  const [category, setCategory] = useState<DocumentCategory>('Production & Dispatch');
  const [reportingPeriod, setReportingPeriod] = useState('FY 2024-25');
  const [mineProjectRef, setMineProjectRef] = useState('');
  const [tagsInput, setTagsInput] = useState('Production, Stripping Ratio, Overburden');
  const [sampleContent, setSampleContent] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [stages, setStages] = useState<PipelineStage[]>(DEFAULT_STAGES);
  const [completedDoc, setCompletedDoc] = useState<MiningDocument | null>(null);

  // Fast demo presets for testing
  const loadPreset = (presetType: 'SECL_BULLETIN' | 'CMPDI_BOREHOLE' | 'MCL_COMPLIANCE') => {
    if (presetType === 'SECL_BULLETIN') {
      setTitle('SECL Dipka Expansion Project Monthly Production & Overburden Return');
      setSourceOrg('SECL');
      setDocumentType('Mining Production Bulletin');
      setCategory('Production & Dispatch');
      setReportingPeriod('Q2 FY 2024-25');
      setMineProjectRef('Dipka Opencast Project (40 MTPA)');
      setTagsInput('Raw Coal Extraction, OBR, 42m3 Shovel, Dumpers, Dispatch');
      setSampleContent(
        `DIPKA EXPANSION OPENCAST MINE\nSouth Eastern Coalfields Limited (CIL Subsidiary)\nReporting Quarter: Q2 FY 2024-25\n\n1. Operational Summary: Raw coal extraction for Q2 stood at 10.40 MT, bringing cumulative first-half output to 20.80 MT against the statutory MoU target of 21.00 MT. Overburden removal recorded 31.20 Mm³ with an aggregate stripping ratio of 1.50 m³/t.\n\n2. Heavy Earth Moving Fleet: 4 electric rope shovels (42m³) operated with 91.2% availability. Haul road dust suppression was managed with 12 mist water sprinklers.\n\n3. Quality Profile: Composite coal dispatch to Sipat Super Thermal Power Station conformed to Grade G-11 with average gross calorific value of 3,920 kcal/kg.`
      );
    } else if (presetType === 'CMPDI_BOREHOLE') {
      setTitle('CMPDI Regional Institute V Exploration & Deep Borehole Core Appraisal');
      setSourceOrg('CMPDI');
      setDocumentType('Borehole Exploration Log');
      setCategory('Geology & Exploration');
      setReportingPeriod('FY 2024-25');
      setMineProjectRef('Hasdeo-Arand Coalfield Sector B');
      setTagsInput('Core Logging, Seam Correlation, Barakar Formation, Proved Reserves');
      setSampleContent(
        `CMPDI REGIONAL INSTITUTE V - EXPLORATION MEMORANDUM\nBasin: Hasdeo-Arand Coalfield, Sector B\n\n1. Stratigraphic Succession: Deep exploratory borehole BH-HA-204 drilled to 340.50 metres intersected Seam III at 182.40m with net clean coal thickness of 5.60 metres. Core recovery averaged 94.2%.\n\n2. Resource Classification: Proved geological coal reserves in Sector B are estimated at 410.80 MT. Coal seams are non-coking, predominantly Grade G-10 with air-dried ash content of 29.80%.\n\n3. Overburden Interburden: Sandstone roof shows unconfined compressive strength of 52 MPa, indicating favorable opencast excavation conditions.`
      );
    } else {
      setTitle('MCL Ib Valley Coalfield Environmental Monitoring & statutory Compliance');
      setSourceOrg('MCL');
      setDocumentType('Environmental Clearance');
      setCategory('Regulatory & Compliance');
      setReportingPeriod('FY 2024-25');
      setMineProjectRef('Lakhanpur & Belpahar OCP');
      setTagsInput('Air Quality, PM10, Effluent Discharge, Green Belt Plantation');
      setSampleContent(
        `MAHANADI COALFIELDS LIMITED - ENVIRONMENTAL AUDIT RETURN\nUnit: Lakhanpur Opencast Project\n\n1. Environmental Standards Compliance: Continuous Ambient Air Quality Monitoring (CAAQM) recorded 24-hour mean PM10 concentrations of 72.4 µg/m³ against permissible limit of 100 µg/m³.\n\n2. Plantation Audit: 85,000 native timber saplings were planted along overburden external dumps for slope stabilization.\n\n3. Coal Dispatch: Total rail dispatch through mechanized SILO loading system was 14.20 MT with zero demurrage losses.`
      );
    }
  };

  const handleStartProcessing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsProcessing(true);
    setCompletedDoc(null);

    // Simulate 9-stage pipeline progression
    const updatedStages = [...DEFAULT_STAGES];
    for (let i = 0; i < updatedStages.length; i++) {
      updatedStages[i].status = 'running';
      setStages([...updatedStages]);
      await new Promise((r) => setTimeout(r, 380));
      updatedStages[i].status = 'completed';
      setStages([...updatedStages]);
    }

    // Build synthesized document object
    const docId = `DOC-${sourceOrg}-${Date.now().toString().slice(-4)}`;
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    const newDoc: MiningDocument = {
      id: docId,
      title: title.trim(),
      documentType,
      sourceOrg,
      reportingPeriod,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: '3.6 MB',
      mimeType: 'application/pdf',
      mineProjectRef: mineProjectRef.trim() || `${sourceOrg} Operational Division`,
      category,
      status: 'Processed',
      tags,
      fieldsCount: 4,
      verifiedCount: 4,
      flaggedCount: 0,
      summaryText: sampleContent.slice(0, 220) + '...',
      passages: [
        {
          id: `p-${Date.now()}-1`,
          page: 1,
          sectionTitle: 'Operational Overview & Extraction Metrics',
          text: sampleContent.slice(0, 300) || `${title} statutory extraction and geological metrics verified across 12 monitoring points.`,
        },
        {
          id: `p-${Date.now()}-2`,
          page: 3,
          sectionTitle: 'Technical Reserve & Equipment Observations',
          text: sampleContent.slice(300) || `Overburden removal and stripping ratio remained compliant with CMPDI approved mine plan specifications.`,
        },
      ],
      tables: [
        {
          id: `tbl-${Date.now()}`,
          title: 'Table 1: Extracted Parameters Matrix',
          pageNumber: 2,
          headers: ['Parameter', 'Reported Value', 'Unit', 'Method'],
          rows: [
            ['Production Output', '10.40', 'MT', 'Digital Text'],
            ['Overburden Removal', '31.20', 'Mm³', 'Table Parser'],
            ['Stripping Ratio', '1.50', 'm³/t', 'Calculated'],
          ],
        },
      ],
    };

    addDocument(newDoc);
    setCompletedDoc(newDoc);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE5EB] shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C47A43] text-white flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202B38]">Document Ingestion & Multi-Stage OCR Pipeline</h2>
              <p className="text-xs text-[#6B7785] mt-0.5">
                Ingest scanned PDFs, spreadsheets (XLSX/CSV), DOCX files, and geological core trays with automated field normalization.
              </p>
            </div>
          </div>

          {/* Quick Demo Load Presets */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#6B7785]">Demo Presets:</span>
            <button
              type="button"
              onClick={() => loadPreset('SECL_BULLETIN')}
              className="px-2 py-1 text-[11px] font-medium bg-[#F3F6F8] hover:bg-[#C47A43]/10 hover:text-[#C47A43] text-[#435164] rounded border border-[#DFE5EB] transition-colors cursor-pointer"
            >
              SECL Bulletin
            </button>
            <button
              type="button"
              onClick={() => loadPreset('CMPDI_BOREHOLE')}
              className="px-2 py-1 text-[11px] font-medium bg-[#F3F6F8] hover:bg-[#C47A43]/10 hover:text-[#C47A43] text-[#435164] rounded border border-[#DFE5EB] transition-colors cursor-pointer"
            >
              CMPDI Core
            </button>
            <button
              type="button"
              onClick={() => loadPreset('MCL_COMPLIANCE')}
              className="px-2 py-1 text-[11px] font-medium bg-[#F3F6F8] hover:bg-[#C47A43]/10 hover:text-[#C47A43] text-[#435164] rounded border border-[#DFE5EB] transition-colors cursor-pointer"
            >
              MCL Audit
            </button>
          </div>
        </div>
      </div>

      {/* Main Upload Form & Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Input Form */}
        <form onSubmit={handleStartProcessing} className="bg-white p-5 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-4 text-xs">
          <div className="font-bold text-sm text-[#202B38] flex items-center gap-2 pb-2 border-b border-[#DFE5EB]">
            <FileText className="w-4 h-4 text-[#C47A43]" />
            Document Metadata & Source File
          </div>

          {/* Dropzone Simulation */}
          <div className="border-2 border-dashed border-[#DFE5EB] hover:border-[#C47A43] rounded-lg p-5 text-center bg-[#F3F6F8]/60 transition-colors cursor-pointer">
            <UploadCloud className="w-8 h-8 mx-auto text-[#6B7785]" />
            <div className="font-semibold text-[#202B38] mt-2">
              Select or Drop Mining Document (PDF, XLSX, CSV, DOCX)
            </div>
            <div className="text-[11px] text-[#6B7785] mt-1">
              Supports scanned high-resolution geological maps & tabular returns up to 50MB
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202B38] mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. SECL Gevra Expansion Annual Geological Survey"
              className="w-full px-3 py-2 rounded-lg border border-[#DFE5EB] focus:outline-hidden focus:border-[#C47A43]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Subsidiary / Agency *</label>
              <select
                value={sourceOrg}
                onChange={(e) => setSourceOrg(e.target.value as Subsidiary)}
                className="w-full px-3 py-2 rounded-lg border border-[#DFE5EB] bg-white font-medium"
              >
                <option value="CMPDI">CMPDI</option>
                <option value="SECL">SECL</option>
                <option value="MCL">MCL</option>
                <option value="BCCL">BCCL</option>
                <option value="CCL">CCL</option>
                <option value="ECL">ECL</option>
                <option value="WCL">WCL</option>
                <option value="NCL">NCL</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Reporting Period *</label>
              <input
                type="text"
                required
                value={reportingPeriod}
                onChange={(e) => setReportingPeriod(e.target.value)}
                placeholder="e.g. FY 2024-25"
                className="w-full px-3 py-2 rounded-lg border border-[#DFE5EB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 rounded-lg border border-[#DFE5EB] bg-white"
              >
                <option value="Geological Appraisal">Geological Appraisal</option>
                <option value="Mining Production Bulletin">Mining Production Bulletin</option>
                <option value="Borehole Exploration Log">Borehole Exploration Log</option>
                <option value="Environmental Clearance">Environmental Clearance</option>
                <option value="Statutory Return">Statutory Return</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#202B38] mb-1">Mine / Project Identifier</label>
              <input
                type="text"
                value={mineProjectRef}
                onChange={(e) => setMineProjectRef(e.target.value)}
                placeholder="e.g. Gevra OC / Jharia Block IX"
                className="w-full px-3 py-2 rounded-lg border border-[#DFE5EB]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#202B38] mb-1">Extracted Text Content (Preview)</label>
            <textarea
              rows={3}
              value={sampleContent}
              onChange={(e) => setSampleContent(e.target.value)}
              placeholder="Paste raw text or click one of the demo presets above to auto-populate with domain text..."
              className="w-full px-3 py-2 rounded-lg border border-[#DFE5EB] text-[11px] font-mono leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing || !title.trim()}
            className="w-full py-2.5 text-xs font-bold text-white bg-[#C47A43] hover:bg-[#C47A43]/90 disabled:opacity-50 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Executing 9-Stage Ingestion Pipeline...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Process Document & Extract Intelligence
              </>
            )}
          </button>
        </form>

        {/* Right: Live 9-Stage Pipeline Status Tracker */}
        <div className="bg-white p-5 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#DFE5EB]">
            <div className="font-bold text-sm text-[#202B38] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#278A85]" />
              Automated 9-Stage Ingestion Pipeline
            </div>
            <span className="font-mono text-[10px] text-[#6B7785]">CIL Statutory OCR v2.4</span>
          </div>

          <div className="space-y-2.5">
            {stages.map((stage) => {
              const isDone = stage.status === 'completed';
              const isRunning = stage.status === 'running';

              return (
                <div
                  key={stage.id}
                  className={`p-2.5 rounded-lg border transition-all text-xs flex items-start gap-2.5 ${
                    isDone
                      ? 'bg-[#2E805A]/5 border-[#2E805A]/30 text-[#202B38]'
                      : isRunning
                      ? 'bg-[#C47A43]/10 border-[#C47A43]/40 text-[#202B38]'
                      : 'bg-[#F3F6F8]/60 border-[#DFE5EB]/60 text-[#6B7785]'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2E805A]" />
                    ) : isRunning ? (
                      <Loader2 className="w-4 h-4 text-[#C47A43] animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#DFE5EB] flex items-center justify-center text-[10px] font-mono">
                        {stage.id}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span className={isDone ? 'text-[#2E805A]' : isRunning ? 'text-[#C47A43]' : ''}>
                        {stage.name}
                      </span>
                      {isDone && <span className="font-mono text-[10px] text-[#2E805A]">Verified</span>}
                      {isRunning && <span className="font-mono text-[10px] text-[#C47A43] animate-pulse">Running...</span>}
                    </div>
                    <div className="text-[11px] text-[#6B7785] mt-0.5 leading-tight">
                      {stage.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {completedDoc && (
            <div className="p-3.5 bg-[#2E805A]/10 border border-[#2E805A]/30 rounded-lg text-xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 text-[#2E805A] font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Document Ingestion Successful!</span>
              </div>
              <p className="text-[#435164] text-[11px]">
                "{completedDoc.title}" has been indexed with {completedDoc.passages.length} passages and committed to the document library.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setSelectedDocForView(completedDoc)}
                  className="px-3 py-1 text-xs font-semibold text-[#17263C] bg-white rounded border border-[#DFE5EB] hover:bg-[#F3F6F8] shadow-2xs"
                >
                  Inspect Passages & Tables
                </button>
                <button
                  onClick={() => setActiveSection('library')}
                  className="px-3 py-1 text-xs font-semibold text-white bg-[#17263C] rounded hover:bg-[#17263C]/90 shadow-2xs"
                >
                  Go to Library
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
