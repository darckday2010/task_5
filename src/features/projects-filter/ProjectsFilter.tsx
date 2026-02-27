// src/features/projects-filter/ProjectsFilter.tsx
import React, { useState } from "react";
import { Select } from "@consta/uikit/Select";
import { Button } from "@consta/uikit/Button";
import { Text } from "@consta/uikit/Text";

import { ManagersFilter } from "../managers-filter/ManagersFilter";

type Option = { label: string; id: string };

const departments: Option[] = [
	{ label: "Разведка", id: "Разведка" },
	{ label: "Добыча", id: "Добыча" },
	{ label: "Переработка", id: "Переработка" },
	{ label: "Логистика", id: "Логистика" },
	{ label: "Сбыт", id: "Сбыт" },
];

const statuses: Option[] = [
	{ label: "Активный", id: "Активный" },
	{ label: "Завершён", id: "Завершён" },
	{ label: "Приостановлен", id: "Приостановлен" },
	{ label: "Планирование", id: "Планирование" },
];

// Добавили приоритеты строго по ТЗ и db.json
const priorities: Option[] = [
	{ label: "Высокий", id: "Высокий" },
	{ label: "Средний", id: "Средний" },
	{ label: "Низкий", id: "Низкий" },
];

export interface FilterValues {
	department?: string;
	status?: string;
	priority?: string;
	managers?: { mode: "include" | "exclude"; ids: number[] };
}

interface ProjectsFilterProps {
	onApply: (filters: FilterValues) => void;
}

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ onApply }) => {
	const [department, setDepartment] = useState<Option | null>(null);
	const [status, setStatus] = useState<Option | null>(null);
	const [priority, setPriority] = useState<Option | null>(null);
	const [managersFilter, setManagersFilter] = useState<{ mode: "include" | "exclude"; ids: number[] }>({ mode: "include", ids: [] });

	const [resetKey, setResetKey] = useState(0);

	const handleApply = () => {
		onApply({
			department: department?.id,
			status: status?.id,
			priority: priority?.id,
			managers: managersFilter,
		});
	};

	const handleReset = () => {
		setDepartment(null);
		setStatus(null);
		setPriority(null);
		setManagersFilter({ mode: "include", ids: [] });
		setResetKey((prev) => prev + 1);
		onApply({});
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				<Text weight="bold" size="s">
					Департамент
				</Text>
				<Select
					placeholder="Выберите департамент"
					items={departments}
					value={department}
					onChange={(value) => setDepartment(value)}
					style={{ width: "100%" }}
				/>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				<Text weight="bold" size="s">
					Статус
				</Text>
				<Select
					placeholder="Выберите статус"
					items={statuses}
					value={status}
					onChange={(value) => setStatus(value)}
					style={{ width: "100%" }}
				/>
			</div>

			<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				<Text weight="bold" size="s">
					Приоритет
				</Text>
				<Select
					placeholder="Выберите приоритет"
					items={priorities}
					value={priority}
					onChange={(value) => setPriority(value)}
					style={{ width: "100%" }}
				/>
			</div>

			<ManagersFilter key={resetKey} onChange={setManagersFilter} />

			{/* --- ИСПРАВЛЕННЫЙ БЛОК КНОПОК --- */}
			<div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
				<Button label="Применить" onClick={handleApply} width="full" />
				<Button label="Сбросить" onClick={handleReset} view="secondary" width="full" />
			</div>
		</div>
	);
};
