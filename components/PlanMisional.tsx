
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  UserPlus, Users, UserCheck, UserRound, Target, 
  Trash2, Plus, Check, List, 
  X, ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  ArrowLeft
} from 'lucide-react';

// ==========================================
// 1. DEFINICIONES Y TIPOS
// ==========================================

export type AreaId = 'finding' | 'teaching' | 'new_members' | 'returning';

export interface ActionItem {
  id: string;
  what: string;
  how: string;
  when: string;
  isCompleted: boolean;
}

export interface AreaData {
  id: AreaId;
  title: string;
  description: string;
  color: string;
  iconName: string;
  items: ActionItem[];
}

export interface AreaConfig {
  id: AreaId;
  title: string;
  shortTitle: string;
  subtitle?: string;
  description: string;
  color: string;
  iconName: string;
}

// ==========================================
// 2. CONSTANTES Y CONFIGURACIÓN
// ==========================================

const getIcon = (name: string, className?: string) => {
  const props = { className: className || "w-6 h-6" };
  switch (name) {
    case 'user-plus': return <UserPlus {...props} />;
    case 'users': return <Users {...props} />;
    case 'user-check': return <UserCheck {...props} />;
    case 'user-round': return <UserRound {...props} />;
    default: return <Target {...props} />;
  }
};

const AREA_CONFIGS: Record<string, AreaConfig> = {
  finding: {
    id: 'finding',
    title: 'Encontrar personas',
    shortTitle: 'Encontrar',
    subtitle: 'Para que los misioneros les enseñen',
    description: 'Estrategias para contactar nuevas personas y compartir el mensaje.',
    color: 'orange',
    iconName: 'user-plus'
  },
  teaching: {
    id: 'teaching',
    title: 'Personas recibiendo enseñanzas',
    shortTitle: 'Enseñando',
    subtitle: 'Apoyar a las personas a quienes los misioneros estén enseñando',
    description: 'Seguimiento al progreso de los investigadores actuales.',
    color: 'amber',
    iconName: 'users'
  },
  new_members: {
    id: 'new_members',
    title: 'Miembros nuevos',
    shortTitle: 'Nuevos Miembros',
    subtitle: 'Fortalecer a los miembros nuevos espiritualmente',
    description: 'Fortalecimiento de los miembros nuevos para su retención.',
    color: 'sky',
    iconName: 'user-check'
  },
  returning: {
    id: 'returning',
    title: 'Miembros que regresan',
    shortTitle: 'Retorno',
    subtitle: 'Fortalecer a los miembros que regresan a la actividad',
    description: 'Apoyo a miembros menos activos para volver a la actividad.',
    color: 'emerald',
    iconName: 'user-round'
  },
};

// ==========================================
// 3. COMPONENTES DE UI (SUB-COMPONENTES)
// ==========================================

// --- DatePicker ---
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const DatePicker: React.FC<{ value: string; onChange: (date: string) => void; color: string; }> = ({ value, onChange, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const formatted = selected.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    onChange(formatted);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-8 w-8" />);

    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = value.includes(`${day} de ${MONTHS[month].toLowerCase()}`);
      let bgClass = "hover:bg-gray-100 text-gray-700";
      if (isSelected) {
        if (color === 'orange') bgClass = "bg-orange-600 text-white shadow-md shadow-orange-200";
        else if (color === 'amber') bgClass = "bg-amber-500 text-white shadow-md shadow-amber-200";
        else if (color === 'sky') bgClass = "bg-sky-500 text-white shadow-md shadow-sky-200";
        else if (color === 'emerald') bgClass = "bg-emerald-600 text-white shadow-md shadow-emerald-200";
        else bgClass = "bg-gray-800 text-white";
      }
      days.push(
        <button key={day} onClick={() => handleDateClick(day)} className={`h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all ${bgClass}`}>
          {day}
        </button>
      );
    }
    return days;
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
    <div className="relative w-full" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 w-full cursor-pointer group">
        <CalendarIcon className={`w-4 h-4 ${getHeaderColor(color)}`} />
        <span className={`text-base font-medium border-b border-transparent group-hover:border-gray-300 transition-colors ${value ? 'text-gray-700' : 'text-gray-400'}`}>
          {value || 'Seleccionar fecha'}
        </span>
      </div>
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-64 z-50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-1 hover:bg-gray-100 rounded-full"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-sm font-bold text-gray-800">{MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-1 hover:bg-gray-100 rounded-full"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>
        </div>
      )}
    </div>
  );
};

// --- ProgressBar ---
const ProgressBar: React.FC<{ percentage: number; color: string }> = ({ percentage, color }) => {
  const getColorClass = (c: string) => {
    switch (c) {
      case 'orange': return 'bg-orange-500 text-orange-700';
      case 'amber': return 'bg-amber-500 text-amber-700';
      case 'sky': return 'bg-sky-500 text-sky-700';
      case 'emerald': return 'bg-emerald-500 text-emerald-700';
      default: return 'bg-gray-500 text-gray-700';
    }
  };
  
  const getBgClass = (c: string) => {
     switch (c) {
      case 'orange': return 'bg-orange-100';
      case 'amber': return 'bg-amber-100';
      case 'sky': return 'bg-sky-100';
      case 'emerald': return 'bg-emerald-100';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="w-full flex flex-col gap-2 mb-6">
      <div className="flex justify-between items-end">
        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Progreso</span>
        <span className={`text-xl font-bold ${getColorClass(color).split(' ')[1]}`}>{Math.round(percentage)}%</span>
      </div>
      <div className={`w-full h-4 ${getBgClass(color)} rounded-full overflow-hidden shadow-inner`}>
        <div className={`h-full ${getColorClass(color).split(' ')[0]} transition-all duration-700 ease-out rounded-full`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

// --- Checkbox & Inputs ---

const GoogleCheckbox: React.FC<{ checked: boolean; onChange: () => void; color: string }> = ({ checked, onChange, color }) => {
  let styles = { border: 'border-gray-600', bg: 'bg-gray-600' };
  if (color === 'orange') styles = { border: 'border-orange-600', bg: 'bg-orange-600' };
  if (color === 'amber') styles = { border: 'border-amber-500', bg: 'bg-amber-500' };
  if (color === 'sky') styles = { border: 'border-sky-500', bg: 'bg-sky-500' };
  if (color === 'emerald') styles = { border: 'border-emerald-600', bg: 'bg-emerald-600' };

  return (
    <div onClick={onChange} className="cursor-pointer -ml-1.5 flex-shrink-0 w-8 h-8 flex items-center justify-center group">
      <div className={`w-4 h-4 border-[2px] rounded-[2px] flex items-center justify-center transition-all ${checked ? `${styles.border} ${styles.bg}` : 'border-gray-400 bg-transparent group-hover:border-gray-500'}`}>
        <Check className={`w-3 h-3 text-white transition-transform ${checked ? 'scale-100' : 'scale-0'}`} />
      </div>
    </div>
  );
};

const AutoResizeTextarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>((props, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [props.value]);
  return (
    <textarea 
      {...props} 
      ref={(node) => { textareaRef.current = node; if (typeof ref === 'function') ref(node); else if (ref) ref.current = node; }} 
      rows={1} 
      className={`resize-none overflow-hidden bg-transparent outline-none border-none focus:ring-0 ${props.className || ''}`} 
    />
  );
});
AutoResizeTextarea.displayName = 'AutoResizeTextarea';

const BulletListEditor: React.FC<{ cardId: string; initialValue: string; onUpdate: (val: string) => void; color: string }> = ({ cardId, initialValue, onUpdate, color }) => {
  const parseLines = (val: string) => val ? val.split('\n').map(l => l.startsWith('[x] ') ? { t: l.substring(4), c: true } : l.startsWith('[ ] ') ? { t: l.substring(4), c: false } : { t: l.replace(/^•\s*/, ''), c: false }) : [{ t: '', c: false }];
  const [lines, setLines] = useState(parseLines(initialValue));
  
  useEffect(() => {
    const serialized = lines.map(l => `${l.c ? '[x] ' : '[ ] '}${l.t}`).join('\n');
    if (serialized !== initialValue) onUpdate(serialized);
  }, [lines, onUpdate]);

  const updateLine = (idx: number, text: string) => { const n = [...lines]; n[idx].t = text; setLines(n); };
  const toggleLine = (idx: number) => { const n = [...lines]; n[idx].c = !n[idx].c; setLines(n); };
  const addLine = (idx: number) => { const n = [...lines]; n.splice(idx + 1, 0, { t: '', c: false }); setLines(n); };
  const removeLine = (idx: number) => { if (lines.length > 1) { const n = [...lines]; n.splice(idx, 1); setLines(n); }};

  return (
    <div className="flex flex-col gap-1 w-full mt-1">
      {lines.map((l, i) => (
        <div key={i} className="flex items-start gap-1">
          <div className="pt-1.5"><GoogleCheckbox checked={l.c} onChange={() => toggleLine(i)} color={color} /></div>
          <AutoResizeTextarea 
            value={l.t} 
            onChange={(e) => updateLine(i, e.target.value)} 
            onKeyDown={(e) => { 
              if (e.key === 'Enter') { e.preventDefault(); addLine(i); }
              if (e.key === 'Backspace' && l.t === '') { e.preventDefault(); removeLine(i); }
            }}
            placeholder={i===0?"Añadir acciones...":"Siguiente..."}
            className={`w-full py-2 px-1 text-lg font-normal ${l.c ? 'text-gray-400' : 'text-gray-700'}`} 
          />
        </div>
      ))}
      {lines.length === 0 && <div onClick={() => setLines([{t:'',c:false}])} className="text-gray-300 italic pl-9 cursor-text">Clic para agregar...</div>}
    </div>
  );
};

const ActionTable: React.FC<{ items: ActionItem[]; color: string; onUpdate: (id: string, f: keyof ActionItem, v: any) => void; onDelete: (id: string) => void; onAdd: () => void }> = ({ items, color, onUpdate, onDelete, onAdd }) => {
  
  const getButtonColor = (c: string) => {
    switch (c) {
      case 'orange': return 'bg-orange-600 hover:bg-orange-700';
      case 'amber': return 'bg-amber-500 hover:bg-amber-600';
      case 'sky': return 'bg-sky-500 hover:bg-sky-600';
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-700';
      default: return 'bg-gray-800 hover:bg-gray-900';
    }
  };

  const getLabelColor = (c: string) => {
    switch (c) {
        case 'orange': return 'text-orange-600';
        case 'amber': return 'text-amber-600';
        case 'sky': return 'text-sky-600';
        case 'emerald': return 'text-emerald-600';
        default: return 'text-gray-600';
    }
  };

  const getCheckButtonStyle = (c: string, checked: boolean, disabled: boolean) => {
      const base = "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-sm";
      
      if (disabled && !checked) {
          return `${base} border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed opacity-70`;
      }
      
      const cursor = "cursor-pointer";

      if (!checked) return `${base} border-gray-300 bg-white hover:border-gray-400 text-gray-400 ${cursor}`;
      
      switch (c) {
          case 'orange': return `${base} border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-200 ${cursor}`;
          case 'amber': return `${base} border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-200 ${cursor}`;
          case 'sky': return `${base} border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-200 ${cursor}`;
          case 'emerald': return `${base} border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-200 ${cursor}`;
          default: return `${base} border-gray-500 bg-gray-500 text-white ${cursor}`;
      }
  };

  const handleDelete = (id: string) => {
      if (window.confirm("¿Eliminar meta?")) {
          onDelete(id);
      }
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {items.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
             <List className="w-8 h-8 text-gray-300" />
          </div>
          <button onClick={onAdd} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium shadow-md ${getButtonColor(color)}`}>
            <Plus className="w-5 h-5" /> Crear Primera Meta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item) => {
            const hasPendingTasks = item.how.includes('[ ]');
            const canComplete = !hasPendingTasks;

            return (
              <div key={item.id} className={`relative bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 ${item.isCompleted ? 'border-green-200 bg-green-50/30' : 'border-gray-100 hover:shadow-md'}`}>
                
                {/* Check Button: Top Right */}
                <div className="absolute top-4 right-4 z-10">
                   <button 
                      type="button"
                      onClick={(e) => {
                          e.stopPropagation();
                          if (canComplete) {
                              onUpdate(item.id, 'isCompleted', !item.isCompleted);
                          }
                      }}
                      disabled={!canComplete && !item.isCompleted}
                      className={getCheckButtonStyle(color, item.isCompleted, !canComplete)}
                      title={!canComplete ? "Debes marcar todas las tareas del '¿Cómo?' primero" : (item.isCompleted ? "Marcar como pendiente" : "Completar meta")}
                    >
                      {(!canComplete && !item.isCompleted) ? (
                           <div className="w-2 h-2 rounded-full bg-gray-300" />
                      ) : (
                           <Check className={`w-5 h-5 ${item.isCompleted ? 'opacity-100' : 'opacity-0'}`} />
                      )}
                    </button>
                </div>

                <div className="flex flex-col h-full gap-5">
                  <div className="flex flex-col gap-1 pr-12">
                    <label className={`text-lg font-bold ${getLabelColor(color)}`}>¿Qué?</label>
                    <AutoResizeTextarea value={item.what} onChange={(e) => onUpdate(item.id, 'what', e.target.value)} placeholder="Define tu objetivo" className="text-lg font-normal border-b border-gray-100" />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <label className={`text-lg font-bold mb-1 ${getLabelColor(color)}`}>¿Cómo?</label>
                    <div className={item.isCompleted ? 'opacity-50 pointer-events-none' : ''}>
                      <BulletListEditor cardId={item.id} initialValue={item.how} onUpdate={(v) => onUpdate(item.id, 'how', v)} color={color} />
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                    <div className="flex flex-col gap-1 flex-1 mr-4">
                      <label className={`text-lg font-bold ${getLabelColor(color)}`}>¿Cuándo?</label>
                      <DatePicker value={item.when} onChange={(v) => onUpdate(item.id, 'when', v)} color={color} />
                    </div>
                    
                    {/* Botón de Eliminar en la esquina inferior derecha */}
                    <button 
                       type="button"
                       onClick={(e) => {
                         e.stopPropagation();
                         handleDelete(item.id);
                       }} 
                       className="relative z-10 text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors self-end"
                       title="Eliminar meta"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          <button onClick={onAdd} className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 rounded-2xl hover:bg-gray-50 transition-all hover:border-gray-300 group">
            <div className={`p-4 rounded-full bg-white shadow-sm mb-3 text-${color}-600 group-hover:scale-110 transition-transform`}><Plus className="w-8 h-8" /></div>
            <span className="text-gray-500 font-medium group-hover:text-gray-700">Agregar Nueva Meta</span>
          </button>
        </div>
      )}
    </div>
  );
};

// --- AreaCard ---
const AreaCard: React.FC<{ config: AreaConfig; onClick: () => void; percentage: number }> = ({ config, onClick, percentage }) => {
  const getCardStyle = (color: string) => {
    switch (color) {
      case 'orange': return 'bg-orange-500 hover:bg-orange-600 shadow-orange-200';
      case 'amber': return 'bg-amber-500 hover:bg-amber-600 shadow-amber-200';
      case 'sky': return 'bg-sky-500 hover:bg-sky-600 shadow-sky-200';
      case 'emerald': return 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200';
      default: return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <button
      onClick={onClick}
      className={`group relative w-full aspect-square p-4 flex flex-col items-center justify-between rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl overflow-hidden ${getCardStyle(config.color)}`}
    >
      <div className="absolute top-3 right-3 z-20">
         <span className="text-[10px] sm:text-xs font-bold text-white bg-white/20 px-2 py-1 rounded-full border border-white/10 backdrop-blur-md shadow-sm">
             {Math.round(percentage)}%
        </span>
      </div>

      <div className="flex-grow flex items-center justify-center w-full mt-2">
        <div className="p-4 sm:p-5 rounded-full bg-white/20 text-white backdrop-blur-md shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-500">
          {getIcon(config.iconName, "w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16")}
        </div>
      </div>

      <div className="relative z-10 w-full text-center pb-6">
        <h3 className="text-sm sm:text-lg md:text-xl font-black text-white leading-tight tracking-tight line-clamp-2 drop-shadow-sm">
          {config.title}
        </h3>
        {config.subtitle && (
          <p className="hidden sm:block text-xs text-white/90 font-light mt-1 line-clamp-1 opacity-80">
            {config.subtitle}
          </p>
        )}
      </div>

      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none group-hover:w-40 group-hover:h-40 transition-all duration-500"></div>
    </button>
  );
};

// ==========================================
// 4. VISTAS PRINCIPALES
// ==========================================

const AreaWorkspace: React.FC<{ config: AreaConfig; data: AreaData; onBack: () => void; onUpdateData: (items: ActionItem[]) => void }> = ({ config, data, onBack, onUpdateData }) => {
  const progress = useMemo(() => data.items.length === 0 ? 0 : (data.items.filter(i => i.isCompleted).length / data.items.length) * 100, [data.items]);
  
  const handleAddItem = () => onUpdateData([...data.items, { id: Date.now().toString(), what: '', how: '[ ] ', when: '', isCompleted: false }]);
  const handleUpdateItem = (id: string, field: keyof ActionItem, value: any) => onUpdateData(data.items.map(i => i.id === id ? { ...i, [field]: value } : i));
  const handleDeleteItem = (id: string) => onUpdateData(data.items.filter(i => i.id !== id));

  const getPageBackground = (c: string) => {
    switch (c) {
        case 'orange': return 'bg-orange-50';
        case 'amber': return 'bg-amber-50';
        case 'sky': return 'bg-sky-50';
        case 'emerald': return 'bg-emerald-50';
        default: return 'bg-gray-50';
    }
  };

  const getHeaderStyles = (c: string) => {
    switch (c) {
        case 'orange': return 'bg-orange-600 shadow-orange-200';
        case 'amber': return 'bg-amber-500 shadow-amber-200';
        case 'sky': return 'bg-sky-600 shadow-sky-200';
        case 'emerald': return 'bg-emerald-600 shadow-emerald-200';
        default: return 'bg-gray-800';
    }
  };

  const renderQuestions = () => {
    let q1 = "", q2 = "";
    if (config.id === 'finding') {
      q1 = "¿Cómo encontrar a más personas para que los misioneros les enseñen?";
      q2 = "¿Cómo ayudar a los miembros a experimentar el gozo de compartir el Evangelio?";
    } else if (config.id === 'teaching') {
      q1 = "¿Cómo apoyar a las personas a quienes están enseñando los misioneros?";
      q2 = "¿Cómo ayudarles a sentirse bienvenidos en las reuniones y actividades del barrio?";
    } else if (config.id === 'new_members') {
      q1 = "¿Cómo ayudar a los miembros nuevos a progresar espiritualmente?";
      q2 = "¿Cómo ayudarles a sentirse bienvenidos en las reuniones y actividades del barrio?";
    } else if (config.id === 'returning') {
      q1 = "¿Cómo ayudar a los miembros que regresan a progresar espiritualmente?";
      q2 = "¿Cómo ayudarles a sentirse bienvenidos en las reuniones y actividades del barrio?";
    } else {
      return null;
    }

    // Matching style with "Enfoque" card
    return (
      <div className={`bg-white/60 p-6 rounded-2xl border border-${config.color}-200 mb-8`}>
        <div className="flex flex-col gap-3">
           <div className="flex gap-3 items-start">
             <div className={`w-1.5 h-1.5 rounded-full bg-${config.color}-500 mt-2 flex-shrink-0`} />
             <p className={`text-sm text-${config.color}-900/80 leading-relaxed`}>
               {q1}
             </p>
           </div>
           {q2 && (
             <div className="flex gap-3 items-start">
               <div className={`w-1.5 h-1.5 rounded-full bg-${config.color}-500 mt-2 flex-shrink-0`} />
               <p className={`text-sm text-${config.color}-900/80 leading-relaxed`}>
                 {q2}
               </p>
             </div>
           )}
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-500 ${getPageBackground(config.color)}`}>
      <header className={`sticky top-0 z-30 shadow-md transition-colors duration-300 ${getHeaderStyles(config.color)}`}>
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 -ml-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"><ArrowLeft className="w-6 h-6" /></button>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/20 text-white backdrop-blur-sm">{getIcon(config.iconName)}</div>
              <h1 className="text-xl font-bold text-white">{config.title}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-4 duration-500">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <ProgressBar percentage={progress} color={config.color} />
             <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                 {progress === 100 
                   ? "¡Excelente trabajo! Has completado todas las metas de esta área." 
                   : "“Cuando el rendimiento se mide, dicho rendimiento mejora. Cuando el rendimiento se mide y se informa, el ritmo de mejoramiento se acelera”"}
             </p>
          </div>
          <div className={`hidden lg:block bg-white/60 p-6 rounded-2xl border border-${config.color}-200`}>
            <h3 className={`font-semibold text-${config.color}-800 mb-2`}>Enfoque</h3>
            <p className={`text-sm text-${config.color}-900/80 leading-relaxed`}>
              {config.description}
            </p>
          </div>
        </div>
        <div className="lg:col-span-9">
          {renderQuestions()}
          
          <div className="mt-8">
            <ActionTable items={data.items} color={config.color} onUpdate={handleUpdateItem} onDelete={handleDeleteItem} onAdd={handleAddItem} />
          </div>
        </div>
      </main>
    </div>
  );
};

// ==========================================
// 5. COMPONENTE PRINCIPAL (EXPORTADO)
// ==========================================

export const PlanMisional = ({ onBack }: { onBack: () => void }) => {
  const [currentView, setCurrentView] = useState<'home' | AreaId>('home');
  const [areasData, setAreasData] = useState<Record<AreaId, AreaData>>(() => {
    const initial: any = {};
    Object.keys(AREA_CONFIGS).forEach((key) => {
      const k = key as AreaId;
      initial[k] = { id: k, ...AREA_CONFIGS[k], items: [] };
    });
    return initial;
  });

  const getPercentage = (areaId: AreaId) => {
    const items = areasData[areaId].items;
    return items.length === 0 ? 0 : (items.filter(i => i.isCompleted).length / items.length) * 100;
  };

  const handleUpdateAreaItems = (areaId: AreaId, newItems: ActionItem[]) => {
    setAreasData(prev => ({ ...prev, [areaId]: { ...prev[areaId], items: newItems } }));
  };

  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <header className="bg-slate-800 shadow-lg border-b border-slate-700 flex-shrink-0 relative">
          <div className="max-w-7xl mx-auto px-4 h-24 flex items-center justify-center relative">
             <button 
                onClick={onBack}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
             >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline text-sm font-medium">Menú Principal</span>
             </button>

            <h1 className="text-2xl sm:text-3xl font-black text-white leading-none tracking-tight">
              Plan Misional
            </h1>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {Object.values(AREA_CONFIGS).map((config) => (
                <AreaCard
                  key={config.id}
                  config={config}
                  onClick={() => setCurrentView(config.id)}
                  percentage={getPercentage(config.id)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  const activeConfig = AREA_CONFIGS[currentView];
  const activeData = areasData[currentView];

  return (
    <AreaWorkspace
      config={activeConfig}
      data={activeData}
      onBack={() => setCurrentView('home')}
      onUpdateData={(items) => handleUpdateAreaItems(currentView, items)}
    />
  );
};
