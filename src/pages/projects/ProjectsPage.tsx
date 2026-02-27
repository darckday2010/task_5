import React, { useState } from "react";
import { ProjectsTable } from "../../widgets/projects-table/ProjectsTable";
import { FiltersPanel, FilterValues } from "../../widgets/filters-panel/FiltersPanel";

export const ProjectsPage: React.FC = () => {
	const [filters, setFilters] = useState<FilterValues>({});

	return (
		<div style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginTop: "24px" }}>
			<FiltersPanel onApply={setFilters} />

			<div style={{ flex: 1, minWidth: 0 }}>
				<ProjectsTable filters={filters} />
			</div>
		</div>
	);
};
