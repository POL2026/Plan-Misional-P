
import React, { useState } from 'react';
import { WARDS_CONFIG } from '../constants';
import { Lock, Loader2 } from 'lucide-react';

interface WardSelectorProps {
  onSelect: (wardId: string) => void;
}

const WardSelector: React.FC<WardSelectorProps> = ({ onSelect }) => {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Función para normalizar texto (quita tildes y hace minúsculas)
  // Ejemplo: "Jardínes" -> "jardines"
  const normalize = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setError(false);

    // Buscamos si lo que escribió coincide con la contraseña O con el nombre del barrio
    // Ejemplo: Si escribe "Primavera" coincidirá con el barrio id 'primavera'
    const ward = WARDS_CONFIG.find(w => {
        const inputClean = normalize(val);
        const passwordClean = normalize(w.password);
        const nameClean = normalize(w.name); // Permite escribir "Barrio Primavera"
        
        // Coincidencia exacta con la contraseña o parcial con el nombre
        return inputClean === passwordClean || (inputClean.length > 4 && nameClean.includes(inputClean));
    });

    if (ward) {
        setLoading(true);
        // Delay reducido (300ms) para mejorar la percepción de velocidad
        setTimeout(() => {
            onSelect(ward.id);
        }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 animate-in fade-in duration-700 relative overflow-hidden">
      
      {/* Fondo Decorativo */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          {/* Changed font-black to font-bold for a thinner look */}
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tight uppercase drop-shadow-lg">
            Plan Misional
          </h1>
          {/* Subtitle removed */}
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl transition-all duration-300">
            <div className="flex flex-col gap-6">
                
                {/* Input Contraseña */}
                <div className="flex flex-col gap-2">
                    <div className="relative group">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${loading ? 'text-blue-400' : 'text-slate-400 group-focus-within:text-white'}`}>
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
                        </div>
                        <input 
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            disabled={loading}
                            placeholder="Nombre de tu barrio"
                            className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl py-4 pl-12 pr-4 outline-none focus:border-blue-500 focus:bg-slate-800 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 font-sans tracking-widest text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Feedback state */}
                <div className={`text-center transition-opacity duration-300 h-6 ${loading ? 'opacity-100' : 'opacity-0'}`}>
                    <span className="text-blue-400 text-sm font-semibold tracking-wide animate-pulse">
                        Accediendo al barrio...
                    </span>
                </div>
            </div>
        </div>
        
        {/* Footer text removed */}

      </div>
    </div>
  );
};

export default WardSelector;
