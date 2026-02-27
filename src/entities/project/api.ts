import { apiClient } from "../../shared/api/base";
import { Project } from "../../shared/api/types";

export interface GetProjectsParams {
	_page?: number;
	_limit?: number;
	_sort?: string;
	_order?: "asc" | "desc";
	// Позже мы добавим сюда фильтры (department, status и т.д.)
	[key: string]: any;
}

export const getProjects = (params: GetProjectsParams) => {
	return apiClient<Project[]>("/projects", params);
};
