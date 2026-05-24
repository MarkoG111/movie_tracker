const STORAGE_KEY = "my_movies_list_restore";

export type ListType = "toWatch" | "watched";

export type SortBy = "title" | "year" | "rating";

export interface ListRestoreFilters {
    searchQuery: string;
    selectedGenre: string;
    sortBy: SortBy;
    showFilters: boolean;
}

export interface ListScrollRestoreState {
    listKey: ListType;
    pathname: string;
    scrollY: number;
    visibleCount: number;
    movieImdbId: string;
    filters: ListRestoreFilters;
}

/** In-memory copy survives React StrictMode remount (sessionStorage alone does not). */
let memoryCache: ListScrollRestoreState | null = null;

function readFromSessionStorage(): ListScrollRestoreState | null {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }

        return JSON.parse(raw) as ListScrollRestoreState;
    } catch {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

export function saveListScrollRestore(state: ListScrollRestoreState): void {
    memoryCache = state;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/** Read without clearing — safe to call multiple times (e.g. StrictMode). */
export function getListScrollRestore(
    listKey: ListType
): ListScrollRestoreState | null {
    if (!memoryCache) {
        memoryCache = readFromSessionStorage();
    }

    if (!memoryCache || memoryCache.listKey !== listKey) {
        return null;
    }

    return memoryCache;
}

export function peekListScrollRestore(): ListScrollRestoreState | null {
    if (!memoryCache) {
        memoryCache = readFromSessionStorage();
    }

    return memoryCache;
}

export function clearListScrollRestore(): void {
    memoryCache = null;
    sessionStorage.removeItem(STORAGE_KEY);
}

export function computeVisibleCountForIndex(index: number): number {
    if (index < 0) {
        return 18;
    }

    return Math.max(18, Math.ceil((index + 1) / 18) * 18);
}
