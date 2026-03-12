import React, { useEffect, useMemo, useRef, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, PaginationModule, ValueFormatterParams, ICellRendererParams } from "ag-grid-community";
import { ServerSideRowModelModule, ColDef, IServerSideDatasource, IServerSideGetRowsParams } from "ag-grid-enterprise";
import { Badge } from "@consta/uikit/Badge";

import { getProjects, Project, ProjectStatus, Department, ProjectPriority, GetProjectsParams } from "entities/project";
import { gpnTheme } from "shared/config/ag-grid/theme";
import { AG_GRID_LOCALE_RU } from "shared/config/ag-grid/locale-ru";
import { SelectionMode } from "features/managers-filter";

ModuleRegistry.registerModules([ServerSideRowModelModule, PaginationModule]);

export interface ProjectsTableFilters {
	department?: Department;
	status?: ProjectStatus;
	priority?: ProjectPriority;
	managers?: { mode: SelectionMode; ids: number[] };
}

interface ProjectsTableProps {
	filters: ProjectsTableFilters;
}

// --- 1. Форматтер для денег ---
const currencyFormatter = (params: ValueFormatterParams) => {
	if (params.value == null) return "";
	return new Intl.NumberFormat("ru-RU", {
		style: "currency",
		currency: "RUB",
		maximumFractionDigits: 0,
	}).format(params.value);
};

// --- 2. Рендерер для Статуса ---
const StatusCellRenderer = (props: ICellRendererParams) => {
	const status = props.value as ProjectStatus;
	if (!status) return null;

	let statusColor: "success" | "warning" | "error" | "normal" | "system" = "normal";
	if (status === ProjectStatus.Active) statusColor = "success";
	else if (status === ProjectStatus.Paused) statusColor = "error";
	else if (status === ProjectStatus.Planning) statusColor = "warning";
	else if (status === ProjectStatus.Completed) statusColor = "system";

	return <Badge label={status} status={statusColor} size="s" form="round" />;
};

// --- 3. Рендерер для Прогресса ---
const ProgressCellRenderer = (props: ICellRendererParams) => {
	const progress = props.value || 0;
	const barColor = progress >= 80 ? "#4caf50" : progress >= 40 ? "#ff9800" : "#f44336";

	return (
		<div style={{ display: "flex", alignItems: "center", height: "100%", gap: "8px" }}>
			<div style={{ flex: 1, backgroundColor: "#e0e0e0", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
				<div style={{ width: `${progress}%`, backgroundColor: barColor, height: "100%", transition: "width 0.3s" }} />
			</div>
			<span style={{ fontSize: "12px", minWidth: "32px", textAlign: "right", fontWeight: 500 }}>{progress}%</span>
		</div>
	);
};

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ filters }) => {
	const columnDefs = useMemo<ColDef<Project>[]>(
		() => [
			{ field: "id", headerName: "ID", width: 90 },
			{ field: "projectName", headerName: "Проект", flex: 1, minWidth: 200 },
			{ field: "department", headerName: "Департамент" },
			{ field: "status", headerName: "Статус", cellRenderer: StatusCellRenderer },
			{ field: "priority", headerName: "Приоритет", width: 130 },
			{ field: "managerName", headerName: "Менеджер", minWidth: 150 },
			{ field: "budget", headerName: "Бюджет", sortable: true, valueFormatter: currencyFormatter },
			{ field: "spent", headerName: "Потрачено", valueFormatter: currencyFormatter },
			{ field: "progress", headerName: "Прогресс", sortable: true, cellRenderer: ProgressCellRenderer },
			{ field: "startDate", headerName: "Дата начала" },
		],
		[],
	);

	const abortControllerRef = useRef<AbortController | null>(null);
	const fetchRows = useCallback(
		async (params: IServerSideGetRowsParams) => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}

			const abortController = new AbortController();
			abortControllerRef.current = abortController;

			try {
				const { startRow, endRow, sortModel } = params.request;
				const limit = (endRow || 50) - (startRow || 0);
				const page = Math.floor((startRow || 0) / limit) + 1;

				const apiParams: GetProjectsParams = {
					_page: page,
					_limit: limit,
				};

				if (sortModel && sortModel.length > 0) {
					const { colId, sort } = sortModel[0];
					apiParams._sort = colId;
					if (sort === "asc" || sort === "desc") {
						apiParams._order = sort;
					}
				}

				if (filters.department) apiParams.department = filters.department;
				if (filters.status) apiParams.status = filters.status;
				if (filters.priority) apiParams.priority = filters.priority;
				if (filters.managers?.ids?.length) {
					if (filters.managers.mode === SelectionMode.Include) {
						apiParams.managerId = filters.managers.ids;
					} else {
						apiParams.managerId_ne = filters.managers.ids;
					}
				}

				const { data, totalCount } = await getProjects(apiParams, abortController.signal);

				params.success({ rowData: data, rowCount: totalCount });
			} catch (error: any) {
				if (error.name === "AbortError" || error.message === "canceled") {
					return;
				}
				console.error("Ошибка загрузки данных:", error);
				params.fail();
			}
		},
		[filters],
	);

	const serverSideDatasource = useMemo<IServerSideDatasource>(
		() => ({
			getRows: (params) => {
				fetchRows(params);
			},
		}),
		[fetchRows],
	);

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	return (
		<div style={{ height: "calc(100vh - 150px)", width: "100%" }}>
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
