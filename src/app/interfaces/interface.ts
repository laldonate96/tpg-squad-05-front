interface TaskWork {
    id: number;
    taskName: string;
    projectName: string;
    createdAt: string;
    hours: number;
  }

  interface Resource {
    id: string;
    nombre: string;
    apellido: string;
    dni: string;
    rolId: string;
  }

  interface Task {
    id: string;
    nombre: string;
    proyectoId: string;
  }

  interface Project {
    id: string;
    nombre: string;
  }

  interface TaskData {
    taskId: string;
    hours: string;
    createdAt?: string;
    taskName?: string;
  }

  interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate: string | null;
    onSubmit: (data: TaskData) => void;
  }

  interface Project {
    id: string;
    nombre: string;
  }

  interface RolePrice {
    [key: string]: number;
  }

  interface ReportData {
    totalResources: number;
    year: number;
    totalHours: number;
    resources: {
      resourceId: string;
      totalHours: number;
      apellido: string;
      monthlyHours: {
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
      };
      nombre: string;
      dni: string;
      rolId: string;
    }[];
    projectId: string;
  }

  interface MonthlyHours {
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

  interface ResourceWithHours extends Resource {
    resourceId: string;
    totalHours: number;
    apellido: string;
    monthlyHours: MonthlyHours;
    nombre: string;
    dni: string;
    rolId: string;
  }

  interface ReportModalProps {
    data: ReportData;
    rolePrices: RolePrice;
    onClose: () => void;
  }
