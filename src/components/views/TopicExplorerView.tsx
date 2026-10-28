import React, { useState } from 'react';
import { 
  Network, 
  Search, 
  FileText, 
  Eye, 
  ExternalLink, 
  Layers, 
  BarChart2,
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { extractTopicsAndFrequencies, WordCloudItem } from '../../utils/textProcessing';
import strataDiagramImg from '../../assets/images/coal_geological_strata_1793211246760.jpg';

export const TopicExplorerView: React.FC = () => {
  const { documents, setSelectedDocForView, activeSubsidiary } = useApp();

  const filteredDocs = activeSubsidiary === 'ALL'
    ? documents
    : documents.filter((d) => d.sourceOrg === activeSubsidiary);

  const topics = extractTopicsAndFrequencies(filteredDocs);
  const [selectedTopic, setSelectedTopic] = useState<WordCloudItem | null>(topics[0] || null);
  const [topicSearch, setTopicSearch] = useState('');

  // Filter topics
  const displayedTopics = topicSearch.trim()
    ? topics.filter((t) => t.text.toLowerCase().includes(topicSearch.toLowerCase()))
    : topics;

  // Documents matching selected topic
  const matchingDocuments = selectedTopic
    ? filteredDocs.filter((d) => selectedTopic.matchingDocIds.includes(d.id))
    : [];

  const categoryColors: Record<WordCloudItem['category'], { text: string; bg: string; border: string }> = {
    geology: { text: '#17263C', bg: 'bg-[#17263C]/10', border: 'border-[#17263C]/30' },
    production: { text: '#C47A43', bg: 'bg-[#C47A43]/10', border: 'border-[#C47A43]/30' },
    stripping: { text: '#278A85', bg: 'bg-[#278A85]/10', border: 'border-[#278A85]/30' },
    quality: { text: '#B7791F', bg: 'bg-[#B7791F]/10', border: 'border-[#B7791F]/30' },
    regulatory: { text: '#435164', bg: 'bg-[#435164]/10', border: 'border-[#435164]/30' },
  };

  return (
    <div className="space-y-6">
      {/* Header and Methodology Box */}
      <div className="bg-white p-5 rounded-xl border border-[#DFE5EB] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C47A43] text-white flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202B38]">
                Statutory Topic Explorer & Linguistic Frequency Matrix
              </h2>
              <p className="text-xs text-[#6B7785] mt-0.5">
                Deterministic text analysis: Normalized token frequencies, n-gram mining, and domain stop-word removal.
              </p>
            </div>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#6B7785]" />
            <input
              type="text"
              value={topicSearch}
              onChange={(e) => setTopicSearch(e.target.value)}
              placeholder="Filter topics..."
              className="w-full bg-[#F3F6F8] pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#DFE5EB] focus:outline-hidden focus:border-[#C47A43]"
            />
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#DFE5EB] text-[11px]">
          <span className="font-semibold text-[#6B7785]">Domain Clusters:</span>
          <span className="flex items-center gap-1.5 text-[#17263C]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#17263C]" /> Geology & Stratigraphy
          </span>
          <span className="flex items-center gap-1.5 text-[#C47A43]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C47A43]" /> Raw Coal Production
          </span>
          <span className="flex items-center gap-1.5 text-[#278A85]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#278A85]" /> Overburden & Stripping
          </span>
          <span className="flex items-center gap-1.5 text-[#B7791F]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B7791F]" /> Coal Quality & Ash
          </span>
          <span className="flex items-center gap-1.5 text-[#435164]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#435164]" /> Statutory & Compliance
          </span>
        </div>
      </div>

      {/* Interactive Word Cloud Visualizer */}
      <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DFE5EB]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C47A43]" />
            <h3 className="font-bold text-sm text-[#202B38]">
              Frequency-Weighted Word Cloud (Click to Filter Sources)
            </h3>
          </div>
          <span className="font-mono text-xs text-[#6B7785]">
            {displayedTopics.length} Extracted Topics
          </span>
        </div>

        {/* Dynamic Cloud Layout */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 p-6 bg-[#F3F6F8] rounded-xl border border-[#DFE5EB]/60 min-h-[220px]">
          {displayedTopics.map((topic) => {
            const isSelected = selectedTopic?.text === topic.text;
            const styleConf = categoryColors[topic.category];

            // Calculate font size proportional to normalized score (12px to 28px)
            const fontSizePx = Math.max(11, Math.min(26, Math.round(11 + (topic.score / 100) * 15)));

            return (
              <button
                key={topic.text}
                onClick={() => setSelectedTopic(topic)}
                style={{ fontSize: `${fontSizePx}px` }}
                className={`font-semibold tracking-tight px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#17263C] text-white border-[#17263C] shadow-md scale-105 ring-2 ring-[#C47A43]'
                    : `${styleConf.bg} ${styleConf.border} hover:scale-102 hover:shadow-xs`
                }`}
              >
                <span style={{ color: isSelected ? '#FFFFFF' : styleConf.text }}>
                  {topic.text}
                </span>
                <span className="font-mono text-[10px] ml-1.5 opacity-70">
                  {topic.weight}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Topic Details & Linked Passages */}
      {selectedTopic && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Matched Source Passages */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#DFE5EB] shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#DFE5EB]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#202B38]">
                    Source Passages for: <span className="text-[#C47A43]">"{selectedTopic.text}"</span>
                  </h3>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F3F6F8] text-[#435164] font-semibold">
                    {selectedTopic.category.toUpperCase()}
                  </span>
                </div>
                <div className="text-xs text-[#6B7785] mt-0.5">
                  Occurs {selectedTopic.weight} times across {selectedTopic.matchingDocIds.length} repository documents.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {matchingDocuments.map((doc) => {
                // Find passages mentioning the topic
                const term = selectedTopic.text.toLowerCase();
                const matchedPassages = doc.passages.filter((p) =>
                  p.text.toLowerCase().includes(term) || doc.title.toLowerCase().includes(term)
                );

                return (
                  <div key={doc.id} className="p-4 bg-[#F3F6F8]/70 rounded-lg border border-[#DFE5EB] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#17263C] bg-white px-1.5 py-0.5 rounded border border-[#DFE5EB]">
                          {doc.sourceOrg}
                        </span>
                        <span className="font-semibold text-[#202B38]">{doc.title}</span>
                      </div>
                      <button
                        onClick={() => setSelectedDocForView(doc)}
                        className="text-xs font-semibold text-[#278A85] hover:text-[#17263C] flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Inspect Document
                      </button>
                    </div>

                    {matchedPassages.map((p) => (
                      <div key={p.id} className="p-2.5 bg-white rounded border border-[#DFE5EB] text-xs space-y-1">
                        <div className="flex justify-between items-center text-[11px] font-mono text-[#6B7785]">
                          <span>Page {p.page} {p.sectionTitle && `· ${p.sectionTitle}`}</span>
                        </div>
                        <p className="text-[#435164] italic text-xs leading-relaxed">
                          "{p.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Stratigraphic Context & Statistics */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs overflow-hidden">
              <div className="p-3 bg-[#17263C] text-white font-bold text-xs flex items-center justify-between">
                <span>Geological Correlation Context</span>
                <span className="text-[10px] font-mono text-[#278A85]">CMPDI Stratum Reference</span>
              </div>
              <img
                src={strataDiagramImg}
                alt="Geological strata cross-section"
                className="w-full h-44 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-3 text-[11px] text-[#435164] leading-relaxed">
                Stratigraphic borehole cross-section showing Barakar formation coal seams, sandstone interburdens, and drilling depth horizons.
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[#DFE5EB] shadow-2xs p-4 space-y-2 text-xs">
              <div className="font-bold text-[#202B38]">Linguistic Extraction Details</div>
              <div className="flex justify-between py-1 border-b border-[#DFE5EB]">
                <span className="text-[#6B7785]">Token Name:</span>
                <span className="font-mono font-semibold">{selectedTopic.text}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DFE5EB]">
                <span className="text-[#6B7785]">Raw Frequency:</span>
                <span className="font-mono font-bold text-[#C47A43]">{selectedTopic.weight} occurrences</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#DFE5EB]">
                <span className="text-[#6B7785]">Normalized Prominence:</span>
                <span className="font-mono">{selectedTopic.score} / 100</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6B7785]">Linked Filings:</span>
                <span className="font-mono">{selectedTopic.matchingDocIds.length} documents</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
