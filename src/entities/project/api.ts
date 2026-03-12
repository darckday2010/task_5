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

type JsonServerParams = Omit<GetProjectsParams, "managerId" | "managerId_ne"> & {
	managerId_ne?: string[];
	managerId_like?: string;
	[key: string]: string | number | boolean | string[] | number[] | undefined;
};

export const getProjects = async (params: GetProjectsParams, signal?: AbortSignal): Promise<{ data: Project[]; totalCount: number }> => {
	const { managerId, managerId_ne, ...restParams } = params;

	const apiParams: JsonServerParams = {
		...restParams,
	};

	/**
	 * ХАК ДЛЯ JSON-SERVER:
	 * json-server имеет баг типизации при поиске по массивам чисел через GET-параметры.
	 * Строка URL `?managerId=1&managerId=2` парсится бэкендом как массив строк ["1", "2"].
	 * При внутреннем поиске json-server использует строгое равенство (===),
	 * поэтому строка "1" не совпадает с числом 1 из БД, и сервер возвращает пустой ответ [].
	 * * Обходное решение: трансформируем массив ID в паттерн регулярного выражения.
	 * `managerId_like=^(1|2|3)$` заставляет сервер приводить типы к строке и искать точные
	 * совпадения по Regex, что успешно фильтрует записи.
	 */
	if (managerId && managerId.length > 0) {
		apiParams.managerId_like = `^(${managerId.join("|")})$`;
	}

	if (managerId_ne && managerId_ne.length > 0) {
		apiParams.managerId_ne = managerId_ne.map(String);
	}

	const response = await apiClient<ProjectDto[]>(API_ENDPOINTS.PROJECTS, apiParams, signal);
	const mappedData = response.data.map(mapProjectDtoToDomain);

	return {
		data: mappedData,
		totalCount: response.totalCount,
	};
};
