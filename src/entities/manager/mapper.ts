import { Manager, ManagerDto } from "./types";
import { Department } from "../../shared/api/types";

export const mapManagerDtoToDomain = (dto: ManagerDto): Manager => {
	return {
		id: dto.id,
		name: dto.name,
		department: dto.department as Department,
	};
};
