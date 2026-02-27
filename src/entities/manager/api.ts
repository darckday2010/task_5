import { apiClient } from "../../shared/api/base";
import { Manager, ManagerDto } from "./types";
import { mapManagerDtoToDomain } from "./mapper";
import { API_ENDPOINTS } from "../../shared/api/endpoints";

export type GetManagersParams = {
	_page?: number;
	_limit?: number;
	name_like?: string;
};

export const getManagers = async (params: GetManagersParams, signal?: AbortSignal): Promise<{ data: Manager[]; totalCount: number }> => {
	const response = await apiClient<ManagerDto[]>(API_ENDPOINTS.MANAGERS, params, signal);
	const mappedData = response.data.map(mapManagerDtoToDomain);

	return {
		data: mappedData,
		totalCount: response.totalCount,
	};
};
