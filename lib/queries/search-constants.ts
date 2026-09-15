export const SEARCH_TYPES = ["ALL", "IDOL", "GROUP", "AGENCY", "ALBUM"] as const;
export const SEARCH_STATUSES = ["ACTIVE", "INACTIVE", "MILITARY", "HIATUS"] as const;
export const SEARCH_GENERATIONS = [1, 2, 3, 4, 5] as const;

export type SearchType = (typeof SEARCH_TYPES)[number];
export type SearchStatus = (typeof SEARCH_STATUSES)[number];
