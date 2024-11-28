declare module '@/app/interfaces/types' {
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

  export interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string | null;
    onSubmit: (data: TaskData) => void;
  }

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

  export interface TaskCardProps {
    task: TaskWork;
    projectColors: { bg: string; text: string };
    onModify: (task: TaskWork) => void;
    onDelete: (id: number) => void;
  }
}

export {};