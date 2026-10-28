import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewView } from './components/views/OverviewView';
import { DocumentLibraryView } from './components/views/DocumentLibraryView';
import { UploadProcessView } from './components/views/UploadProcessView';
import { ExtractedDataView } from './components/views/ExtractedDataView';
import { ResearchAssistantView } from './components/views/ResearchAssistantView';
import { TopicExplorerView } from './components/views/TopicExplorerView';
import { MiningAnalyticsView } from './components/views/MiningAnalyticsView';
import { ReportBuilderView } from './components/views/ReportBuilderView';
import { ReviewApprovalsView } from './components/views/ReviewApprovalsView';
import { ActivityHistoryView } from './components/views/ActivityHistoryView';
import { SettingsView } from './components/views/SettingsView';
import { DocumentModal } from './components/modals/DocumentModal';
import { ValueCorrectionModal } from './components/modals/ValueCorrectionModal';
import { AddRecordModal } from './components/modals/AddRecordModal';

const AppContent: React.FC = () => {
  const { activeSection } = useApp();

  const renderActiveView = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewView />;
      case 'library':
        return <DocumentLibraryView />;
      case 'upload':
        return <UploadProcessView />;
      case 'extracted':
        return <ExtractedDataView />;
      case 'assistant':
        return <ResearchAssistantView />;
      case 'topics':
        return <TopicExplorerView />;
      case 'analytics':
        return <MiningAnalyticsView />;
      case 'reports':
        return <ReportBuilderView />;
      case 'reviews':
        return <ReviewApprovalsView />;
      case 'activity':
        return <ActivityHistoryView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F6F8]">
      {/* Fixed Responsive Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-5 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Interactive Verification & Detail Modals */}
      <DocumentModal />
      <ValueCorrectionModal />
      <AddRecordModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
