export interface Project {
  id: number;
  projectName: string;
  department: Department;
  status: ProjectStatus;
  budget: number;
  spent: number;
  progress: number;
  startDate: string;
  managerId: number;
  manager: string;
  priority: Priority;
}

export interface Manager {
  id: number;
  name: string;
  department: Department;
}

export type Department = 'Разведка' | 'Добыча' | 'Переработка' | 'Логистика' | 'Сбыт';
export type ProjectStatus = 'Активный' | 'Завершён' | 'Приостановлен' | 'Планирование';
export type Priority = 'Высокий' | 'Средний' | 'Низкий';

export const DEPARTMENTS: Department[] = ['Разведка', 'Добыча', 'Переработка', 'Логистика', 'Сбыт'];
export const STATUSES: ProjectStatus[] = ['Активный', 'Завершён', 'Приостановлен', 'Планирование'];
export const PRIORITIES: Priority[] = ['Высокий', 'Средний', 'Низкий'];
