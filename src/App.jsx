import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Screens
import { WorkspaceHome } from './components/screens/WorkspaceHome';
import { ItemRequestWizard } from './components/screens/ItemRequestWizard';
import { PicReviewHub } from './components/screens/PicReviewHub';
import { MonthlyAppraisalHub } from './components/screens/MonthlyAppraisalHub';
import { PoLifecycleBoard } from './components/screens/PoLifecycleBoard';
import { WarehouseWoHub } from './components/screens/WarehouseWoHub';
import { LeaderDashboard } from './components/screens/LeaderDashboard';

// Modals & Drawers
import { TaskClarificationDrawer } from './components/modals/TaskClarificationDrawer';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { ManagementSignOffModal } from './components/modals/ManagementSignOffModal';
import { PoDetailModal } from './components/modals/PoDetailModal';

function MainLayout() {
  const { activeTab } = useApp();

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'workspace':
        return <WorkspaceHome />;
      case 'wizard':
        return <ItemRequestWizard />;
      case 'pic_review':
        return <PicReviewHub />;
      case 'appraisal':
        return <MonthlyAppraisalHub />;
      case 'po_lifecycle':
        return <PoLifecycleBoard />;
      case 'warehouse':
        return <WarehouseWoHub />;
      case 'dashboard':
        return <LeaderDashboard />;
      default:
        return <WorkspaceHome />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC]">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-[1720px] mx-auto animate-fade-in pb-12">
            {renderActiveScreen()}
          </div>
        </main>
      </div>

      {/* Overlays, Drawers & Popups */}
      <TaskClarificationDrawer />
      <CreateTaskModal />
      <ManagementSignOffModal />
      <PoDetailModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
