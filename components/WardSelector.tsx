
import React, { useState } from 'react';
import { WARDS_CONFIG } from '../constants';
import { Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface WardSelectorProps {
  onSelect: (wardId: string) => void;
}

const WardSelector: React.FC<WardSelectorProps> = ({ onSelect }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Call API to verify password
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Contraseña incorrecta');
      })
      .then(data => {
        if (data.success) {
          onSelect(data.wardId);
        } else {
          setError('Contraseña incorrecta. Intente nuevamente.');
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error("Login error:", err);
        setError('Contraseña incorrecta o error de conexión.');
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 animate-in fade-in duration-700">
      
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight uppercase">
            PLAN MISIONAL
          </h1>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8 text-slate-400" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white text-center mb-6">
            Ingreso de Barrio
          </h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ingrese su contraseña..."
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Ingresar</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WardSelector;
