import { apiClient } from "shared/api/base";
import { ProjectDto, Project } from "./types";
import { mapProjectDtoToDomain } from "./mapper";
import { API_ENDPOINTS } from "shared/api/endpoints";

export interface GetProjectsParams {
	_page?: number;
	_limit?: number;
	_sort?: string;
	_order?: "asc" | "desc";
	projectName_like?: string;
	department?: string;
	status?: string;
	priority?: string;
	managerId?: number[];
	managerId_ne?: number[];
}

export const getProjects = async (params: GetProjectsParams): Promise<{ data: Project[]; totalCount: number }> => {
	const safeParams = {
		...params,
		managerId: params.managerId?.map(String),
		managerId_ne: params.managerId_ne?.map(String),
	};
	const response = await apiClient<ProjectDto[]>(API_ENDPOINTS.PROJECTS, safeParams);
	const mappedData = response.data.map(mapProjectDtoToDomain);

	return {
		data: mappedData,
		totalCount: response.totalCount,
	};
};
