
import React, { useRef, useState } from 'react';
import { Printer, ArrowLeft, Calendar } from 'lucide-react';
import { AreaData } from '../types';
import { AREA_CONFIGS, getIcon } from '../constants';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface PlanPreviewProps {
  data: Record<string, AreaData>;
  wardName: string;
  onBack: () => void;
}

const PlanPreview: React.FC<PlanPreviewProps> = ({ data, wardName, onBack }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPdfMode, setIsPdfMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handlePrint = async () => {
    setIsPdfMode(true);
    setIsGenerating(true);
    
    // Allow React to render the "light mode" version
    setTimeout(() => {
      if (contentRef.current) {
        const opt = {
          margin:       5,
          filename:     `Plan_Misional_${wardName.replace(/\s+/g, '_')}.pdf`,
          image:        { type: 'jpeg' as const, quality: 0.98 },
          html2canvas:  { scale: 3, useCORS: true, logging: false },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
          pagebreak:    { mode: 'avoid-all' }
        };

        html2pdf().set(opt).from(contentRef.current).save().then(() => {
          setIsPdfMode(false);
          setIsGenerating(false);
        }).catch((err: any) => {
          console.error("PDF generation failed", err);
          setIsPdfMode(false);
          setIsGenerating(false);
        });
      }
    }, 500);
  };

  // Helper para estilos con degradados vibrantes sin sombras
  const getAreaStyles = (color: string) => {
    // Estilos simplificados para PDF/Impresión (Diseño Profesional Grayscale)
    if (isPdfMode) {
      return {
        headerBg: 'bg-[#f2f2f2] border-b border-gray-300', // Fondo gris claro para título
        titleText: 'text-[#222222]', // Texto oscuro para título
        iconBg: 'text-[#333333]', // Icono oscuro
        divider: 'border-gray-200',
        cardBorder: 'border border-gray-300 shadow-sm' // Bordes sutiles
      };
    }

    switch (color) {
      case 'orange': return {
        headerBg: 'bg-gradient-to-br from-orange-400 to-red-500',
        titleText: 'text-white',
        iconBg: 'bg-white/20 text-white',
        divider: 'border-orange-100',
        cardBorder: 'border-orange-100'
      };
      case 'amber': return {
        headerBg: 'bg-gradient-to-br from-amber-400 to-orange-500', 
        titleText: 'text-white',
        iconBg: 'bg-white/20 text-white',
        divider: 'border-amber-100',
        cardBorder: 'border-amber-100'
      };
      case 'sky': return {
        headerBg: 'bg-gradient-to-br from-sky-400 to-blue-600', 
        titleText: 'text-white',
        iconBg: 'bg-white/20 text-white',
        divider: 'border-sky-100',
        cardBorder: 'border-sky-100'
      };
      case 'emerald': return {
        headerBg: 'bg-gradient-to-br from-emerald-400 to-green-600', 
        titleText: 'text-white',
        iconBg: 'bg-white/20 text-white',
        divider: 'border-emerald-100',
        cardBorder: 'border-emerald-100'
      };
      default: return {
        headerBg: 'bg-slate-800',
        titleText: 'text-white',
        iconBg: 'bg-white/20 text-white',
        divider: 'border-slate-200',
        cardBorder: 'border-slate-200'
      };
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center py-8 transition-colors duration-300 ${isPdfMode ? 'bg-white' : 'bg-slate-900'}`}>
      
      {/* Barra de herramientas (Oculta durante PDF) */}
      <div className={`w-full max-w-4xl px-4 mb-10 flex flex-row justify-between items-center gap-4 animate-in slide-in-from-top-2 ${isPdfMode ? 'opacity-0 pointer-events-none absolute' : ''}`}>
        <button 
          onClick={onBack}
          disabled={isGenerating}
          className="flex justify-center items-center gap-2 px-4 py-2 bg-slate-800 text-slate-300 rounded-full shadow-sm border border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all font-medium disabled:opacity-50"
        >
          <ArrowLeft size={18} />
          Volver a editar
        </button>

        <button 
          onClick={handlePrint}
          disabled={isGenerating}
          className="flex justify-center items-center gap-2 px-6 py-2 bg-white text-slate-900 rounded-full shadow-md hover:bg-slate-200 transition-all font-medium disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-900"></span>
              Generando PDF...
            </>
          ) : (
            <>
              <Printer size={18} />
              Imprimir Plan
            </>
          )}
        </button>
      </div>

      {/* Contenido Principal */}
      <div 
        ref={contentRef}
        className={`w-full max-w-4xl px-4 md:px-0 animate-in fade-in duration-500 ${isPdfMode ? 'text-black max-w-none w-[200mm] mx-auto' : 'text-slate-200'}`}
      >
        
        {/* Encabezado Principal */}
        <header className={`text-center mb-16 ${isPdfMode ? 'mb-6 border-b-2 border-gray-800 pb-4 flex justify-between items-end' : ''}`}>
            {isPdfMode ? (
                <>
                    <div className="text-left">
                        <h1 className="text-3xl font-black uppercase tracking-tight text-gray-900 leading-none">
                        PLAN MISIONAL
                        </h1>
                        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">
                        {wardName}
                        </h2>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-medium">
                            Generado el {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </>
            ) : (
                <>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-2">
                    PLAN MISIONAL
                    </h1>
                    <h2 className="text-sm md:text-base font-light text-slate-400 uppercase tracking-[0.2em]">
                    {wardName}
                    </h2>
                </>
            )}
        </header>

        {/* Lista de Áreas */}
        <div className={isPdfMode ? "grid grid-cols-2 gap-6" : "space-y-8"}>
          {Object.values(AREA_CONFIGS).map((config) => {
            // Filtrar solo las metas NO completadas
            const activeItems = (data[config.id]?.items || []).filter(item => !item.isCompleted);
            
            // Si no hay metas pendientes, no mostramos el área
            if (activeItems.length === 0) return null;

            const styles = getAreaStyles(config.color);

            return (
              <section key={config.id} className="break-inside-avoid mb-4">
                
                {/* Tarjeta del Área (Diseño Profesional Grayscale) */}
                <div className={`rounded-lg overflow-hidden ${styles.cardBorder} ${isPdfMode ? 'bg-white shadow-sm' : 'bg-white shadow-sm border'}`}>
                    
                    {/* Encabezado del Área */}
                    <div className={`${styles.headerBg} p-3 flex items-center gap-3 ${isPdfMode ? 'border-b border-gray-300' : ''}`}>
                        <div className={`p-2 rounded-lg ${styles.iconBg} ${isPdfMode ? 'bg-transparent p-0' : 'backdrop-blur-md shadow-inner bg-white/20'}`}>
                            {getIcon(config.iconName, `w-5 h-5 ${isPdfMode ? 'text-[#333333]' : 'text-white'}`)}
                        </div>
                        <h3 className={`text-sm font-bold uppercase tracking-wider ${styles.titleText}`}>
                            {config.title}
                        </h3>
                    </div>

                    {/* Lista de Metas */}
                    <div className={`p-4 bg-white`}>
                        {activeItems.map((item, index) => (
                            <div 
                            key={item.id} 
                            className={`mb-3 pb-3 ${index !== activeItems.length - 1 ? `border-b ${styles.divider}` : ''} break-inside-avoid last:mb-0 last:pb-0 last:border-0`}
                            >
                            {isPdfMode ? (
                                // Layout PDF Compacto y Profesional
                                <div className="flex flex-col gap-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">Meta</span>
                                        <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 whitespace-nowrap">
                                            {item.when || "Sin fecha"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-800 font-normal leading-relaxed text-justify break-words whitespace-pre-wrap">
                                        {item.what || "Sin definir"}
                                    </p>
                                </div>
                            ) : (
                                // Layout Web Original
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                                    <div className="md:col-span-9">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider mb-2 text-slate-400">
                                            Meta
                                        </span>
                                        <p className="text-lg font-medium text-slate-800 leading-relaxed break-words whitespace-pre-wrap">
                                            {item.what || "Sin definir"}
                                        </p>
                                    </div>
                                    <div className="md:col-span-3 flex md:justify-end mt-2 md:mt-0">
                                        <div className="flex flex-col md:items-end">
                                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1 text-slate-400">
                                            <Calendar size={12} /> Plazo
                                            </span>
                                            <span className="inline-block md:block text-sm font-bold px-3 py-1 rounded-lg text-slate-600 bg-slate-50 border border-slate-100">
                                            {item.when || "Sin fecha"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            </div>
                        ))}
                    </div>
                </div>
              </section>
            );
          })}

          {/* Mensaje si no hay nada pendiente en ninguna área */}
          {Object.values(data).every((area: AreaData) => area.items.filter(i => !i.isCompleted).length === 0) && (
            <div className={`text-center py-24 border-2 border-dashed rounded-3xl col-span-2 ${isPdfMode ? 'border-gray-200 text-black py-8' : 'border-slate-700 bg-slate-800/50'}`}>
              <p className={`font-medium text-lg ${isPdfMode ? 'text-gray-800 text-sm' : 'text-slate-400'}`}>No hay metas pendientes en el plan actualmente.</p>
              <p className={`text-sm mt-2 ${isPdfMode ? 'text-gray-500 text-xs' : 'text-slate-500'}`}>¡Buen trabajo completando tus objetivos!</p>
            </div>
          )}
        </div>

        {/* Pie de página (Solo Web) */}
        {!isPdfMode && (
             <footer className="w-full text-center py-4 border-t border-slate-800 mt-8">
                <p className="text-[10px] text-slate-600 uppercase tracking-widest">
                Plan Misional
                </p>
            </footer>
        )}

      </div>
    </div>
  );
};

export default PlanPreview;
