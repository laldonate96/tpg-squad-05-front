// src/app/interfaces/types.ts

declare module '@/app/interfaces/types' {
  // Basic entity interfaces
  export interface Resource {
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    rolId: string;
  }

  export interface Project {
    id: string;
    nombre: string;
  }

  export interface Task {
    id: string;
    nombre: string;
    proyectoId: string;
  }

  // Task-related interfaces
  export interface TaskWork {
    id: number;
    taskName: string;
    projectName: string;
    createdAt: string;
    hours: number;
  }

  export interface TaskData {
    taskId: string;
    hours: string;
    createdAt?: string;
    taskName?: string;
  }

  // Modal Props interfaces
  export interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string | null;
    onSubmit: (data: TaskData) => void;
  }

  // Report-related interfaces
  export interface MonthlyHours {
    january: number;
    february: number;
    march: number;
    april: number;
    may: number;
    june: number;
    july: number;
    august: number;
    september: number;
    october: number;
    november: number;
    december: number;
  }

  export interface RolePrice {
    [key: string]: number;
  }

  export interface ReportData {
    totalResources: number;
    year: number;
    totalHours: number;
    resources: ResourceWithHours[];
    projectId: string;
  }

  export interface ResourceWithHours extends Resource {
    resourceId: string;
    totalHours: number;
    monthlyHours: MonthlyHours;
  }

  export interface ReportModalProps {
    data: ReportData;
    rolePrices: RolePrice;
    onClose: () => void;
  }
}

// Export something to make this a module
export {};