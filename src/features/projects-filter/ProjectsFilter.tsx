import React, { useState } from "react";
import { Select } from "@consta/uikit/Select";
import { Button } from "@consta/uikit/Button";
import { Text } from "@consta/uikit/Text";

import { ManagersFilter, SelectionMode } from "../managers-filter/ManagersFilter";
import { Department, ProjectStatus, ProjectPriority } from "../../entities/project/types";

const TEXTS = {
	LABELS: {
		DEPARTMENT: "Департамент",
		STATUS: "Статус",
		PRIORITY: "Приоритет",
	},
	PLACEHOLDERS: {
		DEPARTMENT: "Выберите департамент",
		STATUS: "Выберите статус",
		PRIORITY: "Выберите приоритет",
	},
	BUTTONS: {
		APPLY: "Применить",
		RESET: "Сбросить",
	},
} as const;

type Option<T extends string> = { label: string; id: T };

const departmentOptions: Option<Department>[] = Object.values(Department).map((d) => ({ label: d, id: d }));
const statusOptions: Option<ProjectStatus>[] = Object.values(ProjectStatus).map((s) => ({ label: s, id: s }));
const priorityOptions: Option<ProjectPriority>[] = Object.values(ProjectPriority).map((p) => ({ label: p, id: p }));

export interface FilterValues {
	department?: Department;
	status?: ProjectStatus;
	priority?: ProjectPriority;
	managers?: { mode: SelectionMode; ids: number[] };
}

interface ProjectsFilterProps {
	onApply: (filters: FilterValues) => void;
}

export const ProjectsFilter: React.FC<ProjectsFilterProps> = ({ onApply }) => {
	const [department, setDepartment] = useState<Option<Department> | null>(null);
	const [status, setStatus] = useState<Option<ProjectStatus> | null>(null);
	const [priority, setPriority] = useState<Option<ProjectPriority> | null>(null);
	const [managersFilter, setManagersFilter] = useState<{ mode: SelectionMode; ids: number[] }>({
		mode: SelectionMode.Include,
		ids: [],
	});

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
		setManagersFilter({ mode: SelectionMode.Include, ids: [] });
		setResetKey((prev) => prev + 1);
		onApply({});
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
			<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				<Text weight="bold" size="s">
					{TEXTS.LABELS.DEPARTMENT}
				</Text>
				<Select
					placeholder={TEXTS.PLACEHOLDERS.DEPARTMENT}
					items={departmentOptions}
					value={department}
					onChange={(value) => setDepartment(value)}
					style={{ width: "100%" }}
				/>
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				<Text weight="bold" size="s">
					{TEXTS.LABELS.STATUS}
				</Text>
				<Select
					placeholder={TEXTS.PLACEHOLDERS.STATUS}
					items={statusOptions}
					value={status}
					onChange={(value) => setStatus(value)}
					style={{ width: "100%" }}
				/>
			</div>
			<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				<Text weight="bold" size="s">
					{TEXTS.LABELS.PRIORITY}
				</Text>
				<Select
					placeholder={TEXTS.PLACEHOLDERS.PRIORITY}
					items={priorityOptions}
					value={priority}
					onChange={(value) => setPriority(value)}
					style={{ width: "100%" }}
				/>
			</div>
			<ManagersFilter key={resetKey} onChange={setManagersFilter} />
			<div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
				<Button label={TEXTS.BUTTONS.APPLY} onClick={handleApply} width="full" />
				<Button label={TEXTS.BUTTONS.RESET} onClick={handleReset} view="secondary" width="full" />
			</div>
		</div>
	);
};
