
import React, { useState, useEffect } from 'react';
import { AreaId, ActionItem, AreaData } from './types';
import { AREA_CONFIGS, WARDS_CONFIG } from './constants';
import AreaCard from './components/AreaCard';
import AreaWorkspace from './components/AreaWorkspace';
import WardSelector from './components/WardSelector';
import PlanPreview from './components/PlanPreview';
import { LogOut, Eye, Wifi, WifiOff } from 'lucide-react';

// Importar Firebase
import { db } from './firebaseConfig';
// Eliminadas importaciones modulares v9 que causaban error
// import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const App: React.FC = () => {
  // State for Ward Selection
  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'preview' | AreaId>('home');

  // Connection Status
  const [isOnline, setIsOnline] = useState(true);

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

  // --- EFFECT: Real-time Database Sync (Firebase) ---
  useEffect(() => {
    if (!selectedWardId) return;

    // Referencia al documento en la nube: Colección 'plans', Documento 'nombre_del_barrio'
    // Sintaxis v8/Compat: db.collection().doc()
    const docRef = db.collection("plans").doc(selectedWardId);

    // Escuchar cambios en tiempo real (onSnapshot)
    const unsubscribe = docRef.onSnapshot((docSnap) => {
      if (docSnap.exists) { // Sintaxis v8: .exists es propiedad, no función
        // Si existen datos en la nube, los cargamos
        setAreasData(docSnap.data() as Record<AreaId, AreaData>);
        setIsOnline(true);
      } else {
        // Si no existe (es la primera vez), creamos el documento vacío
        const initialData = getInitialData();
        docRef.set(initialData).catch(err => console.error("Error creando plan inicial:", err));
        setAreasData(initialData);
      }
    }, (error) => {
      console.error("Error de conexión con Firebase:", error);
      setIsOnline(false);
    });

    // Limpiar la suscripción cuando se cierra o cambia de barrio
    return () => unsubscribe();
  }, [selectedWardId]);

  // --- Helper: Guardar datos en Firebase ---
  const saveDataToFirebase = async (newData: Record<AreaId, AreaData>) => {
    if (!selectedWardId) return;
    try {
      const docRef = db.collection("plans").doc(selectedWardId);
      await docRef.set(newData);
      setIsOnline(true);
    } catch (error) {
      console.error("Error guardando en Firebase:", error);
      setIsOnline(false);
      alert("Error al guardar: Verifica tu conexión a internet");
    }
  };

  // --- Handlers ---

  const handleUpdateAreaItems = (areaId: AreaId, newItems: ActionItem[]) => {
    // 1. Actualizar estado local (para que se vea rápido)
    const updatedData = {
      ...areasData,
      [areaId]: {
        ...areasData[areaId],
        items: newItems
      }
    };
    setAreasData(updatedData);

    // 2. Enviar a Firebase
    saveDataToFirebase(updatedData);
  };

  const handleLogout = () => {
    setSelectedWardId(null);
    setAreasData(getInitialData());
  };

  const getPercentage = (areaId: AreaId) => {
    const items = areasData[areaId].items;
    if (items.length === 0) return 0;
    const completed = items.filter(i => i.isCompleted).length;
    return (completed / items.length) * 100;
  };

  // --- RENDER: Ward Selector ---
  if (!selectedWardId) {
    return <WardSelector onSelect={setSelectedWardId} />;
  }

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
        
        {/* Connection & Logout Buttons */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
            {/* Indicador de Conexión (Opcional, pero útil) */}
            <div className={`p-2 rounded-full ${isOnline ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`} title={isOnline ? "Conectado a la nube" : "Sin conexión"}>
                {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
            </div>

            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
              title="Cambiar Barrio"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
        </div>

        {/* New Header Design */}
        <div className="pt-16 pb-8 px-4 text-center animate-in slide-in-from-top-4 duration-700">
           <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-2 drop-shadow-lg">
             PLAN MISIONAL
           </h1>
           <div className="flex flex-col gap-2 items-center">
             <div className="flex justify-center items-center gap-2">
               {/* Puntos eliminados */}
               <h2 className="text-lg font-light text-slate-400 uppercase tracking-widest">
                 {currentWardInfo?.name || 'Estaca Primavera'}
               </h2>
             </div>
           </div>
        </div>

        {/* Dashboard Content */}
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
           Estaca Primavera {new Date().getFullYear()}
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
