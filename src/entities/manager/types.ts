import { Department } from "../../shared/api/types";

export interface ManagerDto {
	id: number;
	name: string;
	department: string;
}

export interface Manager {
	id: number;
	name: string;
	department: Department;
}
