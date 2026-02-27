import { apiClient } from "../../shared/api/base";
import { Project } from "../../shared/api/types";

export interface GetProjectsParams {
	_page?: number;
	_limit?: number;
	_sort?: string;
	_order?: "asc" | "desc";
	[key: string]: string | number | boolean | string[] | undefined;
}

export const getProjects = (params: GetProjectsParams) => {
	return apiClient<Project[]>("/projects", params);
};
