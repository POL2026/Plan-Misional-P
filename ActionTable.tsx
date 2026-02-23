import React from 'react';
import { X, Lightbulb } from 'lucide-react';
import { ExampleData } from '../types';

interface ExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
  examples: ExampleData[];
  color: string;
}

const ExampleModal: React.FC<ExampleModalProps> = ({ isOpen, onClose, examples, color }) => {
  if (!isOpen) return null;

  const getColorClasses = (c: string) => {
    switch (c) {
      case 'orange': return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'amber': return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'sky': return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'emerald': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getHeaderColor = (c: string) => {
    switch (c) {
      case 'orange': return 'text-orange-600';
      case 'amber': return 'text-amber-600';
      case 'sky': return 'text-sky-600';
      case 'emerald': return 'text-emerald-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getColorClasses(color).split(' ')[0]}`}>
              <Lightbulb className={`w-5 h-5 ${getHeaderColor(color)}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Ejemplos Prácticos</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-gray-50/50 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 gap-4">
              {examples.map((ex, idx) => (
                <div key={idx} className={`border rounded-xl p-4 ${getColorClasses(color)} shadow-sm`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <span className="text-xs font-bold opacity-70 uppercase tracking-wide">¿Qué?</span>
                      <p className="font-medium text-base min-h-[1.5em]">{ex.what}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold opacity-70 uppercase tracking-wide">¿Cómo?</span>
                      <p className="font-medium text-sm whitespace-pre-line min-h-[1.5em]">{ex.how}</p>
                    </div>
                    <div>
                      <span className="text-xs font-bold opacity-70 uppercase tracking-wide">¿Cuándo?</span>
                      <p className="font-medium text-sm min-h-[1.5em]">{ex.when}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExampleModal;