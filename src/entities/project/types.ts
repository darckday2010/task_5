// --- ДОМЕННЫЕ СЛОВАРИ (Enums) ---
export enum Department {
	Exploration = "Разведка",
	Production = "Добыча",
	Processing = "Переработка",
	Logistics = "Логистика",
	Sales = "Сбыт",
}

export enum ProjectStatus {
	Active = "Активный",
	Completed = "Завершён",
	Paused = "Приостановлен",
	Planning = "Планирование",
}

export enum ProjectPriority {
	High = "Высокий",
	Medium = "Средний",
	Low = "Низкий",
}

export interface ProjectDto {
	id: number;
	projectName: string;
	department: string;
	status: string;
	priority: string;
	budget: number;
	spent: number;
	progress: number;
	startDate: string;
	managerId: number;
	manager: string;
}

export interface Project {
	id: number;
	projectName: string;
	department: Department;
	status: ProjectStatus;
	priority: ProjectPriority;
	budget: number;
	spent: number;
	progress: number;
	startDate: string;
	managerId: number;
	managerName: string;
}
