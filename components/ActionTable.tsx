
import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Check } from 'lucide-react';
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
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
      const base = "w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer";
      
      // Estilo cuando NO está chequeado (Fondo más claro, casi blanco/gris muy suave)
      if (!checked) return `${base} bg-slate-200 hover:bg-slate-300 text-white`;
      
      // Estilo cuando SÍ está chequeado (Color del área)
      switch (c) {
          case 'orange': return `${base} bg-orange-600 text-white shadow-md shadow-orange-200`;
          case 'amber': return `${base} bg-amber-600 text-white shadow-md shadow-amber-200`;
          case 'sky': return `${base} bg-sky-600 text-white shadow-md shadow-sky-200`;
          case 'emerald': return `${base} bg-emerald-600 text-white shadow-md shadow-emerald-200`;
          default: return `${base} bg-gray-600 text-white`;
      }
  };

  const handleDeleteClick = (id: string) => {
      setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteId(null);
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
              <span className="text-lg font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Nueva meta
              </span>
          </div>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">¿Eliminar meta?</h3>
                <p className="text-slate-500 text-sm mt-1">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="flex gap-3 w-full mt-2">
                <button 
                  onClick={cancelDelete}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors shadow-sm shadow-red-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item, index) => {
            const metaNumber = String(index + 1).padStart(2, '0');
            
            return (
            <div 
                key={item.id}
                className={`relative bg-white rounded-2xl p-6 border transition-all duration-300 ${item.isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}
            >
                <div className="flex flex-col h-full gap-5">
                    {/* Header: META 01 + Actions */}
                    <div className="flex flex-col gap-2 flex-grow min-h-[5rem]">
                        <div className="flex justify-between items-start">
                            <label className={`text-lg font-bold ${getLabelColor(color)}`}>
                                Meta {metaNumber}
                            </label>
                            
                            {/* Actions Container */}
                            <div className="flex items-center gap-2">
                                {/* Botón Eliminar */}
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleDeleteClick(item.id);
                                    }}
                                    className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors cursor-pointer"
                                    title="Eliminar meta"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                {/* Botón Check */}
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
                                    <Check className={`w-4 h-4 text-white transition-opacity ${item.isCompleted ? 'opacity-100' : 'opacity-70'}`} strokeWidth={3} />
                                </button>
                            </div>
                        </div>

                        <AutoResizeTextarea
                            value={item.what}
                            onChange={(e) => onUpdate(item.id, 'what', e.target.value)}
                            placeholder="Escribe tu meta aquí..."
                            className={`w-full bg-transparent border-0 focus:border-transparent focus:ring-0 p-0 text-xl font-normal text-gray-800 placeholder-gray-300 transition-colors focus:bg-transparent outline-none shadow-none leading-relaxed ${item.isCompleted ? 'text-gray-500 line-through' : ''} print:hidden`}
                        />
                        {/* Print-only view for better formatting */}
                        <div className={`hidden print:block w-full text-xl font-normal text-black leading-relaxed whitespace-pre-wrap break-words ${item.isCompleted ? 'line-through text-gray-500' : ''}`}>
                            {item.what}
                        </div>
                    </div>

                    {/* Footer: Date Picker (Sin etiqueta Plazo) */}
                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                        <div className="flex flex-col gap-1 flex-1">
                            <DatePicker 
                                value={item.when} 
                                onChange={(val) => onUpdate(item.id, 'when', val)}
                                color={color}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )})}
        
        {/* ADD BUTTON */}
        <AddButtonCard />
      </div>
    </div>
  );
};

export default ActionTable;
