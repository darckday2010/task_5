import { Project, ProjectDto, Department, ProjectStatus, ProjectPriority } from "./types";

export const mapProjectDtoToDomain = (dto: ProjectDto): Project => {
	return {
		id: dto.id,
		projectName: dto.projectName,
		department: dto.department as Department,
		status: dto.status as ProjectStatus,
		priority: dto.priority as ProjectPriority,
		budget: dto.budget,
		spent: dto.spent,
		progress: dto.progress,
		startDate: dto.startDate,
		managerId: dto.managerId,
		managerName: dto.manager,
	};
};
