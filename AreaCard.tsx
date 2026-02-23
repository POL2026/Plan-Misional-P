
import React, { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AreaConfig, ActionItem, AreaData } from '../types';
import ActionTable from './ActionTable';
import ProgressBar from './ProgressBar';
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
  
  const renderProgressContent = () => {
    if (progress === 100) {
      return (
        <p className="text-base text-gray-500 mt-4 leading-relaxed font-medium">
          ¡Excelente trabajo! Has completado todas las metas de esta área.
        </p>
      );
    }

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

    if (questions.length > 0) {
      return (
        <div className="mt-6 flex flex-col gap-4">
          {questions.map((q, idx) => (
            <div key={idx} className="flex gap-3">
              <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white mt-0.5 shadow-sm ${
                 config.color === 'orange' ? 'bg-orange-400' :
                 config.color === 'amber' ? 'bg-amber-400' :
                 config.color === 'sky' ? 'bg-sky-400' : 'bg-emerald-400'
              }`}>
                {idx + 1}
              </span>
              <p className="text-slate-700 font-medium text-lg leading-snug">
                {q}
              </p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <p className="text-sm text-gray-500 mt-4 leading-relaxed italic">
        “Cuando el rendimiento se mide, dicho rendimiento mejora. Cuando el rendimiento se mide y se informa, el ritmo de mejoramiento se acelera” (Thomas S. Monson)
      </p>
    );
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500 ${getPageBackground(config.color)}`}>
      {/* Header with Gradient */}
      <header className={`sticky top-0 z-30 shadow-md transition-colors duration-300 ${getHeaderStyles(config.color)}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left/Top: Progress & Info */}
          <div className="lg:col-span-4 xl:col-span-3 sticky top-20 lg:top-24 z-20 lg:z-0 -mx-4 px-4 lg:mx-0 lg:px-0 py-2 lg:py-0 bg-white/80 backdrop-blur-md lg:bg-transparent shadow-sm lg:shadow-none border-b border-gray-200/50 lg:border-none">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <ProgressBar percentage={progress} color={config.color} />
               {renderProgressContent()}
            </div>
          </div>

          {/* Right/Bottom: Cards Grid */}
          <div className="lg:col-span-8 xl:col-span-9">
             <ActionTable 
                items={data.items}
                color={config.color}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
                onAdd={handleAddItem}
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AreaWorkspace;
