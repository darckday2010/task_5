import React from "react";
import { Text } from "@consta/uikit/Text";
import { ProjectsFilter, FilterValues } from "../../features/projects-filter/ProjectsFilter";

interface FiltersPanelProps {
	onApply: (filters: FilterValues) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ onApply }) => {
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "24px",
				width: "320px",
				padding: "20px",
				border: "1px solid #00416633",
				borderRadius: "8px",
				backgroundColor: "#FFFFFF",
				flexShrink: 0,
			}}
		>
			<Text weight="bold" size="xl">
				Фильтры
			</Text>
			<ProjectsFilter onApply={onApply} />
		</div>
	);
};

// Реэкспортируем тип, чтобы не ломать импорты в ProjectsPage и ProjectsTable
export type { FilterValues };
