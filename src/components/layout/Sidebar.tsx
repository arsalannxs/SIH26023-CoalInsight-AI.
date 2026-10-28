import React from 'react';
import { 
  LayoutDashboard, 
  FolderArchive, 
  UploadCloud, 
  Database, 
  Sparkles, 
  Network, 
  BarChart3, 
  FileText, 
  CheckCircle2, 
  History, 
  Settings,
  Pickaxe,
  AlertCircle
} from 'lucide-react';
import { useApp, NavigationSection } from '../../context/AppContext';

interface NavItem {
  id: NavigationSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
}

export const Sidebar: React.FC = () => {
  const { activeSection, setActiveSection, extractedFields, reports } = useApp();

  const flaggedFieldsCount = extractedFields.filter((f) => f.status === 'NEEDS_REVIEW').length;
  const pendingReportsCount = reports.filter((r) => r.status === 'Needs Review' || r.status === 'Draft').length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'library', label: 'Document Library', icon: FolderArchive },
    { id: 'upload', label: 'Upload & Process', icon: UploadCloud },
    { id: 'extracted', label: 'Extracted Data', icon: Database, badgeCount: flaggedFieldsCount },
    { id: 'assistant', label: 'AI Research Assistant', icon: Sparkles },
    { id: 'topics', label: 'Topic Explorer', icon: Network },
    { id: 'analytics', label: 'Mining Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Report Builder', icon: FileText },
    { id: 'reviews', label: 'Review & Approvals', icon: CheckCircle2, badgeCount: pendingReportsCount },
    { id: 'activity', label: 'Activity History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#17263C] text-white flex flex-col shrink-0 border-r border-[#17263C]/40 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#C47A43] flex items-center justify-center text-white shadow-sm">
          <Pickaxe className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-bold text-base tracking-tight leading-none text-white flex items-center gap-2">
            CoalInsight AI
            <span className="text-[10px] font-mono font-medium text-[#278A85] bg-white/5 px-1.5 py-0.5 rounded">SIH26023</span>
          </div>
          <div className="text-[11px] text-[#DFE5EB]/70 mt-1 truncate">
            CMPDI / Coal India Limited
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] uppercase tracking-wider text-[#DFE5EB]/50 font-semibold font-mono">
          Core Workflows
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#C47A43] text-white font-semibold shadow-sm'
                  : 'text-[#DFE5EB]/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#DFE5EB]/70'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badgeCount !== undefined && item.badgeCount > 0 && (
                <span
                  className={`text-[11px] font-mono px-1.5 py-0.2 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white text-[#C47A43]'
                      : 'bg-[#C47A43] text-white'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Context Info */}
      <div className="p-4 border-t border-white/10 text-xs text-[#DFE5EB]/70 bg-black/10">
        <div className="flex items-center justify-between font-mono text-[11px]">
          <span>Govt of India</span>
          <span className="text-[#278A85]">Ministry of Coal</span>
        </div>
        <p className="text-[11px] text-[#DFE5EB]/60 mt-1 leading-snug">
          Decision-ready geological & mining intelligence with full source traceability.
        </p>
      </div>
    </aside>
  );
};
