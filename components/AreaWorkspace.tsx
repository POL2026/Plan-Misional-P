
import React, { useMemo } from 'react';
import { ArrowLeft, Sprout, Heart, Settings2, ChevronRight } from 'lucide-react';
import { AreaConfig, ActionItem, AreaData } from '../types';
import ActionTable from './ActionTable';
import CircularProgress from './CircularProgress';
import { getIcon } from '../constants';

interface AreaWorkspaceProps {
  config: AreaConfig;
  data: AreaData;
  onBack: () => void;
  onUpdateData: (newItems: ActionItem[]) => void;
}

const AreaWorkspace: React.FC<AreaWorkspaceProps> = ({ config, data, onBack, onUpdateData }) => {
  
  // Calculate Progress
  const progress = useMemo(() => {
    if (data.items.length === 0) return 0;
    const completed = data.items.filter(i => i.isCompleted).length;
    return (completed / data.items.length) * 100;
  }, [data.items]);

  // Handlers
  const handleAddItem = () => {
    const newItem: ActionItem = {
      id: Date.now().toString(),
      what: '',
      how: '', // Field kept for compatibility but empty
      when: '',
      isCompleted: false,
    };
    onUpdateData([...data.items, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof ActionItem, value: any) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    );
    onUpdateData(newItems);
  };

  const handleDeleteItem = (id: string) => {
    const newItems = data.items.filter(item => item.id !== id);
    onUpdateData(newItems);
  };

  // Helper for Header Background Styles - Now using GRADIENTS
  const getHeaderStyles = (c: string) => {
    switch (c) {
        case 'orange': return 'bg-gradient-to-r from-orange-400 to-red-500';
        case 'amber': return 'bg-gradient-to-r from-amber-400 to-orange-500';
        case 'sky': return 'bg-gradient-to-r from-sky-400 to-blue-600';
        case 'emerald': return 'bg-gradient-to-r from-emerald-400 to-green-600';
        default: return 'bg-slate-800';
    }
  };
  
  // Dynamic Background Color for the entire page body
  const getPageBackground = (c: string) => {
    switch (c) {
        case 'orange': return 'bg-orange-50';
        case 'amber': return 'bg-amber-50';
        case 'sky': return 'bg-sky-50';
        case 'emerald': return 'bg-emerald-50';
        default: return 'bg-gray-50';
    }
  };

  // Determine text content based on area
  const isFindingArea = config.id === 'finding';
  const isTeachingArea = config.id === 'teaching';
  const isNewMembersArea = config.id === 'new_members';
  const isReturningArea = config.id === 'returning';
  
  let questions: string[] = [];

  if (isFindingArea) {
    questions = [
      "¿Cómo encontrar a más personas para enseñar?",
      "¿Cómo ayudar a los miembros a experimentar el gozo de compartir el Evangelio?"
    ];
  } else if (isTeachingArea) {
    questions = [
      "¿Cómo apoyar a las personas a quienes los misioneros estén enseñando?",
      "¿Cómo ayudarles a sentirse bienvenidos en las reuniones y actividades del barrio?"
    ];
  } else if (isNewMembersArea) {
    questions = [
      "¿Cómo ayudar a los miembros nuevos a progresar espiritualmente?",
      "¿Cómo ayudarles a sentirse bienvenidos en las reuniones y actividades del barrio?"
    ];
  } else if (isReturningArea) {
    questions = [
      "¿Cómo ayudar a los miembros que regresan a la actividad a progresar espiritualmente?",
      "¿Cómo ayudarles a sentirse bienvenidos en las reuniones y actividades del barrio?"
    ];
  }

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500 ${getPageBackground(config.color)}`}>
      {/* Header with Gradient */}
      <header className={`sticky top-0 z-30 shadow-none md:shadow-md transition-colors duration-300 ${getHeaderStyles(config.color)}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 -ml-2 text-white/90 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20 text-white backdrop-blur-md border border-white/10 shadow-sm">
                {getIcon(config.iconName, "w-6 h-6")}
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-white leading-tight max-w-md line-clamp-2 drop-shadow-sm">
                  {config.title}
                </h1>
                <p className="text-xs text-white/90 hidden sm:block font-medium opacity-90">Plan Misional</p>
              </div>
            </div>
          </div>

          {/* Circular Progress Bar in Header - Simplified */}
          <div>
            <CircularProgress 
              percentage={progress} 
              size={40} 
              strokeWidth={4} 
              color="text-white"
              trackColor="text-white/30"
              textColor="text-white"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-0 md:mt-0 py-4 md:py-8 animate-in slide-in-from-bottom-4 duration-500 relative z-10">
         
         {/* Enfoque Section - Sticky Wrapper */}
         <div className={`sticky top-16 md:top-20 z-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-4 md:pb-6 mb-6 md:mb-8 transition-colors duration-300 ${getPageBackground(config.color)} print:static print:bg-transparent print:p-0 print:m-0 print:mb-4`}>
             <div className="bg-white rounded-3xl p-3 shadow-lg md:shadow-sm border border-slate-100 print:shadow-none print:border-slate-300">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-slate-700">
                        <Settings2 className="w-4 h-4 text-slate-400" />
                        <h2 className="font-bold text-base">Enfoque</h2>
                    </div>
                </div>

                <div className={`relative bg-white border rounded-xl p-3 shadow-sm transition-colors ${
                    config.color === 'orange' ? 'border-orange-100 hover:border-orange-200' :
                    config.color === 'amber' ? 'border-amber-100 hover:border-amber-200' :
                    config.color === 'sky' ? 'border-sky-100 hover:border-sky-200' :
                    config.color === 'emerald' ? 'border-emerald-100 hover:border-emerald-200' :
                    'border-slate-100 hover:border-slate-200'
                } print:border-slate-300 print:shadow-none`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                        config.color === 'orange' ? 'bg-orange-500' :
                        config.color === 'amber' ? 'bg-amber-500' :
                        config.color === 'sky' ? 'bg-sky-500' :
                        config.color === 'emerald' ? 'bg-emerald-500' :
                        'bg-slate-500'
                    } print:bg-slate-800`}></div>
                    <div className="pl-3">
                        <p className="text-sm text-slate-700 font-medium leading-relaxed break-words whitespace-pre-wrap print:text-black">
                            {questions.join(" ") || "Preguntas no definidas"}
                        </p>
                    </div>
                </div>
             </div>
         </div>

         <ActionTable 
            items={data.items}
            color={config.color}
            onUpdate={handleUpdateItem}
            onDelete={handleDeleteItem}
            onAdd={handleAddItem}
         />
      </main>
    </div>
  );
};

export default AreaWorkspace;
