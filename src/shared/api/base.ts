const BASE_URL = "http://localhost:3001";

export async function apiClient<T>(
	endpoint: string,
	params?: Record<string, string | number | boolean | undefined | string[] | number[]>,
	signal?: AbortSignal,
): Promise<{ data: T; totalCount: number }> {
	const url = new URL(`${BASE_URL}${endpoint}`);

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== "") {
				// Поддержка массивов для фильтров (например, managerId=1&managerId=2)
				if (Array.isArray(value)) {
					value.forEach((v) => url.searchParams.append(key, String(v)));
				} else {
					url.searchParams.append(key, String(value));
				}
			}
		});
	}

	const response = await fetch(url.toString(), { signal });

	if (!response.ok) {
		throw new Error(`API Error: ${response.statusText}`);
	}

	// json-server отдает общее количество в заголовке X-Total-Count
	const totalCount = Number(response.headers.get("X-Total-Count")) || 0;
	const data = (await response.json()) as T;

	return { data, totalCount };
}
