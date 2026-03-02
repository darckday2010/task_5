import { Checkbox } from "@consta/uikit/Checkbox";
import { Loader } from "@consta/uikit/Loader";
import { Text } from "@consta/uikit/Text";
import { TextField } from "@consta/uikit/TextField";
import React, { useState, useEffect, useCallback, memo, useRef } from "react";
import { Virtuoso } from "react-virtuoso";

import { getManagers, Manager } from "entities/manager";
import { useDebounce } from "shared/lib/useDebounce";

export enum SelectionMode {
	Include = "include",
	Exclude = "exclude",
}

const LIMIT = 20;
const DEBOUNCE_DELAY_MS = 300;
const DEFAULT_TOTAL_MANAGERS = 250;

const TEXTS = {
	TITLE: "Менеджер проекта",
	SEARCH_PLACEHOLDER: "Поиск менеджера...",
	EMPTY_STATE: "Ничего не найдено",
	CHECKBOX: {
		ALL: "Выбрать все",
		FOUND: (count: number) => `Выбрать найденных (${count})`,
	},
	SUMMARY: (selected: number, total: number) => `Выбрано: ${selected} из ${total || DEFAULT_TOTAL_MANAGERS}`,
} as const;

interface VirtuosoContext {
	isLoading: boolean;
}

interface ManagerListItemProps {
	manager: Manager;
	isChecked: boolean;
	onToggle: (id: number) => void;
}

const ListFooter: React.FC<{ context?: VirtuosoContext }> = ({ context }) => {
	if (!context?.isLoading) return null;
	return (
		<div style={{ padding: "12px", textAlign: "center" }}>
			<Loader size="s" />
		</div>
	);
};

const ManagerListItem = memo(({ manager, isChecked, onToggle }: ManagerListItemProps) => (
	<div style={{ padding: "4px 12px" }}>
		<Checkbox label={manager.name} checked={isChecked} onChange={() => onToggle(manager.id)} />
	</div>
));

interface ManagersFilterProps {
	onChange?: (data: { mode: SelectionMode; ids: number[] }) => void;
}

export const ManagersFilter: React.FC<ManagersFilterProps> = ({ onChange }) => {
	const [managers, setManagers] = useState<Manager[]>([]);
	const [searchValue, setSearchValue] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [globalTotal, setGlobalTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isFetchingAll, setIsFetchingAll] = useState(false);

	const [selectionMode, setSelectionMode] = useState<SelectionMode>(SelectionMode.Include);
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

	const debouncedSearch = useDebounce(searchValue, DEBOUNCE_DELAY_MS);

	const abortControllerRef = useRef<AbortController | null>(null);

	useEffect(() => {
		onChange?.({
			mode: selectionMode,
			ids: Array.from(selectedIds),
		});
	}, [selectionMode, selectedIds, onChange]);

	useEffect(() => {
		return () => {
			if (abortControllerRef.current) {
				abortControllerRef.current.abort();
			}
		};
	}, []);

	const fetchManagers = useCallback(async (currentPage: number, search: string | null, isReset: boolean = false) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}

		const abortController = new AbortController();
		abortControllerRef.current = abortController;

		setIsLoading(true);
		try {
			const { data, totalCount: total } = await getManagers(
				{
					_page: currentPage,
					_limit: LIMIT,
					...(search ? { name_like: search } : {}),
				},
				abortController.signal,
			);

			setManagers((prev) => (isReset ? data : [...prev, ...data]));
			setTotalCount(total);
			if (!search) {
				setGlobalTotal((prev) => (prev === 0 ? total : prev));
			}
		} catch (error: any) {
			if (error.name === "AbortError") {
				console.log("Предыдущий запрос менеджеров отменен");
				return;
			}
			console.error("Ошибка загрузки менеджеров:", error);
		} finally {
			if (abortControllerRef.current === abortController) {
				setIsLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		setPage(1);
		fetchManagers(1, debouncedSearch, true);
	}, [debouncedSearch, fetchManagers]);

	const loadMore = useCallback(() => {
		if (!isLoading && managers.length < totalCount) {
			const nextPage = page + 1;
			setPage(nextPage);
			fetchManagers(nextPage, debouncedSearch, false);
		}
	}, [isLoading, managers.length, totalCount, page, debouncedSearch, fetchManagers]);

	const handleToggleItem = useCallback((id: number) => {
		setSelectedIds((prevIds) => {
			const newIds = new Set(prevIds);
			if (newIds.has(id)) newIds.delete(id);
			else newIds.add(id);
			return newIds;
		});
	}, []);

	const handleToggleAll = async () => {
		if (debouncedSearch) {
			setIsFetchingAll(true);
			try {
				const { data } = await getManagers({ name_like: debouncedSearch });
				const matchingIds = data.map((m) => m.id);

				setSelectedIds((prevIds) => {
					const newIds = new Set(prevIds);
					const allMatchingChecked = matchingIds.every((id) =>
						selectionMode === SelectionMode.Include ? newIds.has(id) : !newIds.has(id),
					);

					const isIncludeMode = selectionMode === SelectionMode.Include;
					const shouldAdd = allMatchingChecked ? !isIncludeMode : isIncludeMode;

					matchingIds.forEach((id) => {
						if (shouldAdd) newIds.add(id);
						else newIds.delete(id);
					});

					return newIds;
				});
			} catch (error) {
				console.error("Ошибка при массовом выборе:", error);
			} finally {
				setIsFetchingAll(false);
			}
		} else if (selectionMode === SelectionMode.Include) {
			setSelectionMode(SelectionMode.Exclude);
			setSelectedIds(new Set());
		} else {
			setSelectionMode(SelectionMode.Include);
			setSelectedIds(new Set());
		}
	};

	const renderItemContent = useCallback(
		(_index: number, manager: Manager) => {
			const isChecked = selectionMode === SelectionMode.Include ? selectedIds.has(manager.id) : !selectedIds.has(manager.id);

			return <ManagerListItem manager={manager} isChecked={isChecked} onToggle={handleToggleItem} />;
		},
		[selectionMode, selectedIds, handleToggleItem],
	);

	const selectedCount = selectionMode === SelectionMode.Include ? selectedIds.size : globalTotal - selectedIds.size;
	const isMasterChecked = !debouncedSearch && selectionMode === SelectionMode.Exclude && selectedIds.size === 0;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "300px" }}>
			<Text weight="bold">{TEXTS.TITLE}</Text>

			<TextField
				placeholder={TEXTS.SEARCH_PLACEHOLDER}
				value={searchValue}
				onChange={(val) => setSearchValue(val)}
				size="s"
				style={{ width: "100%" }}
			/>

			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				<Checkbox
					label={debouncedSearch ? TEXTS.CHECKBOX.FOUND(totalCount) : TEXTS.CHECKBOX.ALL}
					checked={isMasterChecked}
					onChange={handleToggleAll}
					disabled={isFetchingAll}
				/>
				{isFetchingAll && <Loader size="s" />}
			</div>

			<Text size="s" view="ghost">
				{TEXTS.SUMMARY(selectedCount, globalTotal)}
			</Text>

			<div style={{ height: "250px", border: "1px solid #00416633", borderRadius: "4px", padding: "8px 0" }}>
				{managers.length === 0 && !isLoading ? (
					<Text size="s" view="ghost" style={{ padding: "0 12px" }}>
						{TEXTS.EMPTY_STATE}
					</Text>
				) : (
					<Virtuoso
						style={{ height: "100%" }}
						data={managers}
						endReached={loadMore}
						context={{ isLoading }}
						components={{ Footer: ListFooter }}
						itemContent={renderItemContent}
					/>
				)}
			</div>
		</div>
	);
};
