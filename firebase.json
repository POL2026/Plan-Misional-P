
import { AreaConfig } from './types';
import { 
  UserPlus, Users, UserCheck, UserRound, Target,
  Landmark, Sun, Flower2, Trees, Waves, Anchor
} from 'lucide-react';
import React from 'react';

// Icon mapping helper
export const getIcon = (name: string, className?: string) => {
  const props = { className: className || "w-6 h-6" };
  switch (name) {
    // Areas Icons
    case 'user-plus': return <UserPlus {...props} />;
    case 'users': return <Users {...props} />;
    case 'user-check': return <UserCheck {...props} />;
    case 'user-round': return <UserRound {...props} />;
    
    // Wards Icons
    case 'landmark': return <Landmark {...props} />;
    case 'sun': return <Sun {...props} />;
    case 'flower': return <Flower2 {...props} />;
    case 'trees': return <Trees {...props} />;
    case 'waves': return <Waves {...props} />;
    case 'anchor': return <Anchor {...props} />;
    
    default: return <Target {...props} />;
  }
};

export const WARDS_CONFIG = [
  { id: 'tahuantinsuyo', name: 'Barrio Tahuantinsuyo', icon: 'landmark', color: 'from-orange-400 to-red-500', password: 'tahuantinsuyo' },
  { id: 'bellavista', name: 'Barrio Bellavista', icon: 'landmark', color: 'from-yellow-400 to-orange-500', password: 'bellavista' },
  { id: 'primavera', name: 'Barrio Primavera', icon: 'landmark', color: 'from-pink-400 to-rose-500', password: 'primavera' },
  { id: 'jardines', name: 'Barrio Jardines', icon: 'landmark', color: 'from-emerald-400 to-green-600', password: 'jardines' },
  { id: 'villa_del_mar', name: 'Barrio Villa del Mar', icon: 'landmark', color: 'from-cyan-400 to-blue-500', password: 'villadelmar' },
  { id: 'huanchaco', name: 'Barrio Huanchaco', icon: 'landmark', color: 'from-blue-500 to-indigo-600', password: 'huanchaco' },
];

export const AREA_CONFIGS: Record<string, AreaConfig> = {
  finding: {
    id: 'finding',
    title: 'Encontrar personas',
    shortTitle: 'Encontrar',
    subtitle: 'Para que los misioneros les enseñen',
    description: 'Estrategias para contactar nuevas personas y compartir el mensaje.',
    color: 'orange',
    iconName: 'user-plus',
    examples: []
  },
  teaching: {
    id: 'teaching',
    title: 'Personas recibiendo enseñanzas',
    shortTitle: 'Enseñando',
    subtitle: 'Apoyar a las personas a quienes los misioneros estén enseñando',
    description: 'Seguimiento al progreso de los investigadores actuales.',
    color: 'amber',
    iconName: 'users',
    examples: []
  },
  new_members: {
    id: 'new_members',
    title: 'Miembros nuevos',
    shortTitle: 'Nuevos Miembros',
    subtitle: 'Fortalecer a los miembros nuevos espiritualmente',
    description: 'Fortalecimiento de los miembros nuevos para su retención.',
    color: 'sky',
    iconName: 'user-check',
    examples: []
  },
  returning: {
    id: 'returning',
    title: 'Miembros que regresan',
    shortTitle: 'Retorno',
    subtitle: 'Fortalecer a los miembros que regresan a la actividad',
    description: 'Apoyo a miembros menos activos para volver a la actividad.',
    color: 'emerald',
    iconName: 'user-round',
    examples: []
  },
};
