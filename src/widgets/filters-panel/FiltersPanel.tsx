import React, { useState } from "react";
import { Text } from "@consta/uikit/Text";
import { Select } from "@consta/uikit/Select";
import { Button } from "@consta/uikit/Button";

// Импортируем из фич и сущностей (это Виджет, ему можно!)
import { ManagersFilter, SelectionMode } from "features/managers-filter";
import { Department, ProjectStatus, ProjectPriority } from "entities/project";

const FILTER_FIELDS = {
	department: { label: "Департамент", placeholder: "Выберите департамент" },
	status: { label: "Статус", placeholder: "Выберите статус" },
	priority: { label: "Приоритет", placeholder: "Выберите приоритет" },
} as const;

const BUTTON_TEXTS = {
	APPLY: "Применить",
	RESET: "Сбросить",
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

const DEFAULT_STATE = {
	department: null as Option<Department> | null,
	status: null as Option<ProjectStatus> | null,
	priority: null as Option<ProjectPriority> | null,
	managers: { mode: SelectionMode.Include, ids: [] as number[] },
	search: "",
};

interface FiltersPanelProps {
	onApply: (filters: FilterValues) => void;
}

export const FiltersPanel: React.FC<FiltersPanelProps> = ({ onApply }) => {
	const [formState, setFormState] = useState(DEFAULT_STATE);
	const [resetKey, setResetKey] = useState(0);

	const updateField = <K extends keyof typeof formState>(field: K, value: (typeof formState)[K]) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	const handleApply = () => {
		onApply({
			department: formState.department?.id,
			status: formState.status?.id,
			priority: formState.priority?.id,
			managers: formState.managers,
		});
	};

	const handleReset = () => {
		setFormState(DEFAULT_STATE);
		setResetKey((prev) => prev + 1);
		onApply({});
	};

	const renderSelect = (fieldKey: keyof typeof FILTER_FIELDS, items: any[], value: any, onChange: (val: any) => void) => {
		const config = FILTER_FIELDS[fieldKey];
		return (
			<div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
				<Text weight="bold" size="s">
					{config.label}
				</Text>
				<Select placeholder={config.placeholder} items={items} value={value} onChange={onChange} style={{ width: "100%" }} />
			</div>
		);
	};

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

			<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
				{renderSelect("department", departmentOptions, formState.department, (v) => updateField("department", v))}
				{renderSelect("status", statusOptions, formState.status, (v) => updateField("status", v))}
				{renderSelect("priority", priorityOptions, formState.priority, (v) => updateField("priority", v))}

				<ManagersFilter key={resetKey} onChange={(val) => updateField("managers", val)} />

				<div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
					<Button label={BUTTON_TEXTS.APPLY} onClick={handleApply} width="full" />
					<Button label={BUTTON_TEXTS.RESET} onClick={handleReset} view="secondary" width="full" />
				</div>
			</div>
		</div>
	);
};
