import { apiClient } from "../../shared/api/base";
import { Manager } from "../../shared/api/types";

export interface GetManagersParams {
	_page?: number;
	_limit?: number;
	name_like?: string;
	[key: string]: string | number | boolean | string[] | undefined;
}

export const getManagers = (params: GetManagersParams) => {
	return apiClient<Manager[]>("/managers", params);
};
