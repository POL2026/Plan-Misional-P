
import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Check, AlertTriangle, X } from 'lucide-react';
import { ActionItem } from '../types';
import DatePicker from './DatePicker';

interface ActionTableProps {
  items: ActionItem[];
  color: string;
  onUpdate: (id: string, field: keyof ActionItem, value: any) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

// --- Auto Resizing Textarea ---
const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [props.value]);

  return (
    <textarea
      {...props}
      ref={(node) => {
        textareaRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      }}
      rows={1}
      className={`resize-none overflow-hidden block bg-transparent focus:bg-transparent focus:outline-none outline-none border-none focus:ring-0 shadow-none ${props.className || ''}`} 
    />
  );
});
AutoResizeTextarea.displayName = 'AutoResizeTextarea';

// --- Main Action Table ---
const ActionTable: React.FC<ActionTableProps> = ({ items, color, onUpdate, onDelete, onAdd }) => {
  // Estado para controlar qué ítem se está intentando eliminar
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  const getLabelColor = (c: string) => {
    switch (c) {
        case 'orange': return 'text-orange-600';
        case 'amber': return 'text-amber-600';
        case 'sky': return 'text-sky-600';
        case 'emerald': return 'text-emerald-600';
        default: return 'text-gray-600';
    }
  };

  const getCheckButtonStyle = (c: string, checked: boolean) => {
      // Changed from w-9 h-9 to w-7 h-7 for smaller circle
      const base = "w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer";
      
      // Estilo cuando NO está chequeado (Fondo gris claro, icono gris visible)
      if (!checked) return `${base} border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-slate-300`;
      
      // Estilo cuando SÍ está chequeado
      switch (c) {
          case 'orange': return `${base} border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200 scale-105`;
          case 'amber': return `${base} border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-200 scale-105`;
          case 'sky': return `${base} border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-200 scale-105`;
          case 'emerald': return `${base} border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200 scale-105`;
          default: return `${base} border-gray-500 bg-gray-500 text-white`;
      }
  };

  // Solicitar confirmación (abre el modal)
  const requestDelete = (id: string) => {
      setItemToDelete(id);
  };

  // Confirmar eliminación (ejecuta la acción)
  const confirmDelete = () => {
      if (itemToDelete) {
          onDelete(itemToDelete);
          setItemToDelete(null);
      }
  };

  // Componente reutilizable para el botón de agregar
  const AddButtonCard = () => {
    const getStyles = (c: string) => {
        switch (c) {
            case 'orange': return 'text-orange-500 hover:border-orange-300 hover:bg-orange-50';
            case 'amber': return 'text-amber-500 hover:border-amber-300 hover:bg-amber-50';
            case 'sky': return 'text-sky-500 hover:border-sky-300 hover:bg-sky-50';
            case 'emerald': return 'text-emerald-500 hover:border-emerald-300 hover:bg-emerald-50';
            default: return 'text-slate-400 hover:border-slate-300 hover:bg-slate-50';
        }
    };

    return (
      <button
        onClick={onAdd}
        className={`group w-full flex flex-col items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed border-slate-200 bg-white transition-all duration-300 hover:scale-[1.01] p-6 ${getStyles(color)}`}
      >
          <div className="flex flex-col items-center gap-3 transition-transform duration-300 group-hover:-translate-y-1">
              <div className="p-4 rounded-full bg-slate-50 group-hover:bg-white group-hover:shadow-sm transition-all duration-300">
                  <Plus className="w-10 h-10 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-lg font-bold opacity-60 group-hover:opacity-100 uppercase tracking-tight transition-opacity">
                Nueva Meta
              </span>
          </div>
      </button>
    );
  };

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, index) => {
              const metaNumber = String(index + 1).padStart(2, '0');
              
              return (
              <div 
                  key={item.id}
                  className={`relative bg-white rounded-2xl p-6 border transition-all duration-300 ${item.isCompleted ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
              >
                      {/* Check Button: Top Right (Aligned with content via right-6) */}
                      <div className="absolute top-6 right-6 z-10">
                      <button 
                          type="button"
                          onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              onUpdate(item.id, 'isCompleted', !item.isCompleted);
                          }}
                          className={getCheckButtonStyle(color, item.isCompleted)}
                          title={item.isCompleted ? "Marcar como pendiente" : "Completar meta"}
                      >
                          <Check className="w-4 h-4" strokeWidth={3} />
                      </button>
                      </div>

                  <div className="flex flex-col h-full gap-5">
                      {/* Header: META 01, 02... */}
                      <div className="flex flex-col gap-2 flex-grow min-h-[5rem] pr-12">
                          <label className={`text-lg font-bold ${getLabelColor(color)}`}>
                              Meta {metaNumber}
                          </label>
                          <AutoResizeTextarea
                              value={item.what}
                              onChange={(e) => onUpdate(item.id, 'what', e.target.value)}
                              placeholder="Escribe tu meta aquí..."
                              className={`w-full bg-transparent border-0 focus:border-transparent focus:ring-0 p-0 text-xl font-normal text-slate-800 placeholder-slate-300 transition-colors focus:bg-transparent outline-none shadow-none leading-relaxed ${item.isCompleted ? 'text-slate-400 line-through' : ''}`}
                          />
                      </div>

                      {/* Footer: PLAZO & Delete */}
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <div className="flex flex-col gap-1 flex-1 mr-4 relative z-0">
                              <DatePicker 
                                  value={item.when} 
                                  onChange={(val) => onUpdate(item.id, 'when', val)}
                                  color={color}
                              />
                          </div>

                          {/* Delete Button: Bottom Right */}
                          <button 
                              type="button"
                              onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  requestDelete(item.id);
                              }}
                              className="relative z-20 text-slate-300 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-full transition-all duration-300 self-end cursor-pointer group"
                              title="Eliminar meta"
                          >
                              <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          </button>
                      </div>
                  </div>
              </div>
          )})}
          
          {/* ADD BUTTON */}
          <AddButtonCard />
        </div>
      </div>

      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-slate-100"
            role="dialog"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-2">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">¿Eliminar esta meta?</h3>
              </div>

              <div className="grid grid-cols-2 gap-3 w-full mt-2">
                <button 
                  onClick={() => setItemToDelete(null)}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md shadow-red-200 transition-all hover:-translate-y-0.5"
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActionTable;
