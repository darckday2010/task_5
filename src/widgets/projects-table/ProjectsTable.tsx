import React, { useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, PaginationModule } from "ag-grid-community";
import { ServerSideRowModelModule, ColDef, IServerSideDatasource, IServerSideGetRowsParams } from "ag-grid-enterprise";

import { getProjects } from "../../entities/project/api";
import { gpnTheme } from "../../shared/config/ag-grid/theme";
import { AG_GRID_LOCALE_RU } from "../../shared/config/ag-grid/locale-ru";
import { Project } from "../../shared/api/types";
import { FilterValues } from "../filters-panel/FiltersPanel";

ModuleRegistry.registerModules([ServerSideRowModelModule, PaginationModule]);

interface ProjectsTableProps {
	filters: FilterValues;
}

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ filters }) => {
	const columnDefs = useMemo<ColDef<Project>[]>(
		() => [
			{ field: "id", headerName: "ID", width: 90 },
			{ field: "projectName", headerName: "Проект", flex: 1, minWidth: 200 },
			{ field: "department", headerName: "Департамент" },
			{ field: "status", headerName: "Статус" },
			{ field: "priority", headerName: "Приоритет" },
			{ field: "manager", headerName: "Менеджер", minWidth: 150 },
			{ field: "budget", headerName: "Бюджет", sortable: true },
			{ field: "spent", headerName: "Потрачено" },
			{ field: "progress", headerName: "Прогресс", sortable: true },
			{ field: "startDate", headerName: "Дата начала" },
		],
		[],
	);

	const serverSideDatasource = useMemo<IServerSideDatasource>(
		() => ({
			getRows: async (params: IServerSideGetRowsParams) => {
				try {
					const { startRow, endRow, sortModel } = params.request;
					const limit = (endRow || 50) - (startRow || 0);
					const page = Math.floor((startRow || 0) / limit) + 1;

					const apiParams: Record<string, any> = {
						_page: page,
						_limit: limit,
					};

					if (sortModel && sortModel.length > 0) {
						apiParams._sort = sortModel[0].colId;
						apiParams._order = sortModel[0].sort;
					}

					// --- ПРИМЕНЯЕМ ФИЛЬТРЫ К ЗАПРОСУ ---
					if (filters.department) apiParams.department = filters.department;
					if (filters.status) apiParams.status = filters.status;
					if (filters.priority) apiParams.priority = filters.priority;

					if (filters.managers && filters.managers.ids.length > 0) {
						if (filters.managers.mode === "include") {
							apiParams.managerId = filters.managers.ids;
						} else {
							apiParams.managerId_ne = filters.managers.ids;
						}
					}

					const { data, totalCount } = await getProjects(apiParams);

					params.success({
						rowData: data,
						rowCount: totalCount,
					});
				} catch (error) {
					console.error("Ошибка загрузки данных:", error);
					params.fail();
				}
			},
		}),
		[filters],
	);

	return (
		<div style={{ height: "600px", width: "100%" }}>
			<AgGridReact
				theme={gpnTheme}
				localeText={AG_GRID_LOCALE_RU}
				columnDefs={columnDefs}
				rowModelType="serverSide"
				serverSideDatasource={serverSideDatasource}
				pagination={true}
				paginationPageSize={50}
				cacheBlockSize={50}
				defaultColDef={{
					resizable: true,
					sortable: false,
				}}
			/>
		</div>
	);
};
