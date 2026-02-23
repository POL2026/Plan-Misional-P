
import React, { useState, useEffect } from 'react';
import { AreaId, ActionItem, AreaData } from './types';
import { AREA_CONFIGS, WARDS_CONFIG } from './constants';
import AreaCard from './components/AreaCard';
import AreaWorkspace from './components/AreaWorkspace';
import WardSelector from './components/WardSelector';
import PlanPreview from './components/PlanPreview';
import { LogOut, Eye } from 'lucide-react';

const App: React.FC = () => {
  // State for Ward Selection
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  
  // Navigation State (Home = Dashboard of the specific ward)
  const [currentView, setCurrentView] = useState<'home' | 'preview' | AreaId>('home');

  // Initial Empty State Generator
  const getInitialData = (): Record<AreaId, AreaData> => {
    const initial: Record<string, AreaData> = {};
    Object.keys(AREA_CONFIGS).forEach((key) => {
      const k = key as AreaId;
      initial[k] = {
        id: k,
        title: AREA_CONFIGS[k].title,
        description: AREA_CONFIGS[k].description,
        color: AREA_CONFIGS[k].color,
        iconName: AREA_CONFIGS[k].iconName,
        items: []
      };
    });
    return initial as Record<AreaId, AreaData>;
  };

  // Data State
  const [areasData, setAreasData] = useState<Record<AreaId, AreaData>>(getInitialData());

  // --- EFFECT: Load Data when Ward Changes ---
  useEffect(() => {
    if (selectedWardId) {
      // Fetch data from API
      fetch(`/api/ward/${selectedWardId}`)
        .then(res => res.json())
        .then(data => {
          if (data.data && Object.keys(data.data).length > 0) {
            setAreasData(data.data);
          } else {
            setAreasData(getInitialData());
          }
        })
        .catch(err => {
          console.error("Error fetching ward data:", err);
          setAreasData(getInitialData());
        });
      
      // Reset view to home when switching wards
      setCurrentView('home');
    }
  }, [selectedWardId]);

  // --- EFFECT: Save Data when Data Changes ---
  useEffect(() => {
    if (selectedWardId && areasData) {
      // Debounce save to avoid too many requests
      const timeoutId = setTimeout(() => {
        fetch(`/api/ward/${selectedWardId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: areasData }),
        }).catch(err => console.error("Error saving data:", err));
      }, 1000); // 1 second debounce

      return () => clearTimeout(timeoutId);
    }
  }, [areasData, selectedWardId]);

  // --- Handlers ---

  const handleUpdateAreaItems = (areaId: AreaId, newItems: ActionItem[]) => {
    setAreasData(prev => ({
      ...prev,
      [areaId]: {
        ...prev[areaId],
        items: newItems
      }
    }));
  };

  const handleLogout = () => {
    setSelectedWardId(null);
  };

  const getPercentage = (areaId: AreaId) => {
    const items = areasData[areaId].items;
    if (items.length === 0) return 0;
    const completed = items.filter(i => i.isCompleted).length;
    return (completed / items.length) * 100;
  };

  // --- RENDER: Ward Selector (Netflix Style) ---
  if (!selectedWardId) {
    return <WardSelector onSelect={setSelectedWardId} />;
  }

  // Get current ward info for display
  const currentWardInfo = WARDS_CONFIG.find(w => w.id === selectedWardId);

  // --- RENDER: Preview Mode ---
  if (currentView === 'preview') {
    return (
      <PlanPreview 
        data={areasData} 
        wardName={currentWardInfo?.name || "Plan Misional"} 
        onBack={() => setCurrentView('home')} 
      />
    );
  }

  // --- RENDER: Dashboard (Home) ---
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col relative">
        
        {/* Navigation / Logout Button - Subtle Placement */}
        <div className="absolute top-4 right-4 z-50">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              title="Cambiar Barrio"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
        </div>

        {/* New Header Design: Clean Typography */}
        <div className="pt-16 pb-8 px-4 text-center animate-in slide-in-from-top-4 duration-700">
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-2 drop-shadow-lg">
             PLAN MISIONAL
           </h1>
           <div className="flex justify-center items-center gap-2">
             <h2 className="text-lg font-light text-slate-400 uppercase tracking-widest">
               {currentWardInfo?.name || 'Estaca Primavera'}
             </h2>
           </div>
        </div>

        {/* Dashboard Content - Centered 2x2 Grid */}
        <main className="flex-grow flex flex-col items-center justify-start p-4 sm:p-6 lg:p-8 animate-in fade-in duration-700">
          <div className="w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4 mb-10">
              {Object.values(AREA_CONFIGS).map((config) => (
                <AreaCard
                  key={config.id}
                  config={config}
                  onClick={() => setCurrentView(config.id)}
                  completionPercentage={getPercentage(config.id)}
                />
              ))}
            </div>

            {/* Vista Previa Button */}
            <div className="flex justify-center w-full">
              <button
                onClick={() => setCurrentView('preview')}
                className="group flex items-center gap-3 px-8 py-3 bg-slate-800 border border-slate-700 rounded-full shadow-lg hover:shadow-slate-900/50 hover:bg-slate-700 hover:border-slate-500 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="text-slate-500 group-hover:text-white transition-colors">
                  <Eye className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wide group-hover:text-white">
                  Vista Previa
                </span>
              </button>
            </div>

          </div>
        </main>
        
        <footer className="max-w-7xl mx-auto px-4 py-6 text-center text-slate-600 text-xs font-medium uppercase tracking-widest flex-shrink-0">
           
        </footer>
      </div>
    );
  }

  // --- RENDER: Specific Area Workspace ---
  const activeConfig = AREA_CONFIGS[currentView as AreaId];
  const activeData = areasData[currentView as AreaId];

  return (
    <AreaWorkspace
      config={activeConfig}
      data={activeData}
      onBack={() => setCurrentView('home')}
      onUpdateData={(items) => handleUpdateAreaItems(currentView as AreaId, items)}
    />
  );
};

export default App;
