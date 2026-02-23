import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  color: string;
}

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, color }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date()); // For navigation
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
    // Format: "15 de octubre de 2024"
    const formatted = selected.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    
    onChange(formatted);
    setIsOpen(false);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];

    // Empty cells for days before the 1st
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === new Date().getDate() && 
        month === new Date().getMonth() && 
        year === new Date().getFullYear();

      // Check if this date matches the current string value (rough check)
      const isSelected = value.includes(`${day} de ${MONTHS[month].toLowerCase()}`) && value.includes(`${year}`);

      let bgClass = "hover:bg-gray-100 text-gray-700";
      if (isSelected) {
        switch(color) {
            case 'orange': bgClass = "bg-orange-600 text-white shadow-md shadow-orange-200"; break;
            case 'amber': bgClass = "bg-amber-500 text-white shadow-md shadow-amber-200"; break;
            case 'sky': bgClass = "bg-sky-500 text-white shadow-md shadow-sky-200"; break;
            case 'emerald': bgClass = "bg-emerald-600 text-white shadow-md shadow-emerald-200"; break;
            default: bgClass = "bg-gray-800 text-white";
        }
      } else if (isToday) {
        bgClass = "bg-gray-100 font-bold text-gray-900 border border-gray-300";
      }

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-8 w-8 text-xs rounded-full flex items-center justify-center transition-all ${bgClass}`}
        >
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
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 w-full cursor-pointer group`}
      >
        <CalendarIcon className={`w-4 h-4 ${getHeaderColor(color)}`} />
        <span className={`text-lg font-medium border-b border-transparent group-hover:border-gray-300 transition-colors ${value ? 'text-gray-700' : 'text-gray-400'}`}>
          {value || 'Seleccionar fecha'}
        </span>
      </div>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-64 z-50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-sm font-bold text-gray-800 capitalize">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((d, i) => (
              <div key={i} className="h-8 w-8 flex items-center justify-center text-[10px] font-bold text-gray-400">
                {d}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;