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
  color: string; // Tailwind color class prefix (e.g., 'blue', 'emerald')
  iconName: string;
  items: ActionItem[];
}

export interface ExampleData {
  what: string;
  how: string;
  when: string;
}

export interface AreaConfig {
  id: AreaId;
  title: string;
  shortTitle: string;
  subtitle?: string; // Added optional subtitle
  description: string;
  color: string;
  iconName: string;
  examples: ExampleData[];
}