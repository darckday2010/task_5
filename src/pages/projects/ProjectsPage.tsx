import React from "react";
import { ProjectsTable } from "../../widgets/projects-table/ProjectsTable";

export const ProjectsPage: React.FC = () => {
	return (
		<>
			{/* Здесь на Шаге 5 появится виджет фильтров <FiltersPanel /> */}
			<ProjectsTable />
		</>
	);
};
