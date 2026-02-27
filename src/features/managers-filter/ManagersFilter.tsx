import React, { useState, useEffect, useCallback, memo } from "react";
import { Virtuoso } from "react-virtuoso";
import { TextField } from "@consta/uikit/TextField";
import { Checkbox } from "@consta/uikit/Checkbox";
import { Text } from "@consta/uikit/Text";
import { Loader } from "@consta/uikit/Loader";

import { getManagers } from "../../entities/manager/api";
import { Manager } from "../../shared/api/types";
import { useDebounce } from "../../shared/lib/useDebounce";

const LIMIT = 20;

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
	onChange?: (data: { mode: "include" | "exclude"; ids: number[] }) => void;
}

export const ManagersFilter: React.FC<ManagersFilterProps> = ({ onChange }) => {
	const [managers, setManagers] = useState<Manager[]>([]);
	const [searchValue, setSearchValue] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [globalTotal, setGlobalTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [isFetchingAll, setIsFetchingAll] = useState(false);

	const [selectionMode, setSelectionMode] = useState<"include" | "exclude">("include");
	const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

	const debouncedSearch = useDebounce(searchValue, 300);

	// --- ЭФФЕКТ ДЛЯ ПЕРЕДАЧИ ДАННЫХ НАРУЖУ ---
	useEffect(() => {
		onChange?.({
			mode: selectionMode,
			ids: Array.from(selectedIds),
		});
	}, [selectionMode, selectedIds, onChange]);

	const fetchManagers = useCallback(
		async (currentPage: number, search: string | null, isReset: boolean = false) => {
			setIsLoading(true);
			try {
				const { data, totalCount: total } = await getManagers({
					_page: currentPage,
					_limit: LIMIT,
					...(search ? { name_like: search } : {}),
				});

				setManagers((prev) => (isReset ? data : [...prev, ...data]));
				setTotalCount(total);

				if (!search && globalTotal === 0) setGlobalTotal(total);
			} catch (error) {
				console.error("Ошибка загрузки менеджеров:", error);
			} finally {
				setIsLoading(false);
			}
		},
		[globalTotal],
	);

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
					const allMatchingChecked = matchingIds.every((id) => (selectionMode === "include" ? newIds.has(id) : !newIds.has(id)));

					if (allMatchingChecked) {
						matchingIds.forEach((id) => {
							if (selectionMode === "include") newIds.delete(id);
							else newIds.add(id);
						});
					} else {
						matchingIds.forEach((id) => {
							if (selectionMode === "include") newIds.add(id);
							else newIds.delete(id);
						});
					}
					return newIds;
				});
			} catch (error) {
				console.error("Ошибка при массовом выборе:", error);
			} finally {
				setIsFetchingAll(false);
			}
		} else if (selectionMode === "include") {
			setSelectionMode("exclude");
			setSelectedIds(new Set());
		} else {
			setSelectionMode("include");
			setSelectedIds(new Set());
		}
	};

	const renderItemContent = useCallback(
		(_index: number, manager: Manager) => {
			const isChecked = selectionMode === "include" ? selectedIds.has(manager.id) : !selectedIds.has(manager.id);

			return <ManagerListItem manager={manager} isChecked={isChecked} onToggle={handleToggleItem} />;
		},
		[selectionMode, selectedIds, handleToggleItem],
	);

	const selectedCount = selectionMode === "include" ? selectedIds.size : globalTotal - selectedIds.size;
	const isMasterChecked = !debouncedSearch && selectionMode === "exclude" && selectedIds.size === 0;

	return (
		<div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "300px" }}>
			<Text weight="bold">Менеджер проекта</Text>

			<TextField
				placeholder="Поиск менеджера..."
				value={searchValue}
				onChange={(val) => setSearchValue(val)}
				size="s"
				style={{ width: "100%" }}
			/>

			<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
				<Checkbox
					label={debouncedSearch ? `Выбрать найденных (${totalCount})` : "Выбрать все"}
					checked={isMasterChecked}
					onChange={handleToggleAll}
					disabled={isFetchingAll}
				/>
				{isFetchingAll && <Loader size="s" />}
			</div>

			<Text size="s" view="ghost">
				Выбрано: {selectedCount} из {globalTotal || 250}
			</Text>

			<div style={{ height: "250px", border: "1px solid #00416633", borderRadius: "4px", padding: "8px 0" }}>
				{managers.length === 0 && !isLoading ? (
					<Text size="s" view="ghost" style={{ padding: "0 12px" }}>
						Ничего не найдено
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
