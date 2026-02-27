import React from "react";
import { ProjectsTable } from "../../widgets/projects-table/ProjectsTable";
import { ManagersFilter } from "../../features/managers-filter/ManagersFilter";

export const ProjectsPage: React.FC = () => {
	return (
		<div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
			<ManagersFilter />
			<div style={{ flex: 1 }}>
				<ProjectsTable />
			</div>
		</div>
	);
};
