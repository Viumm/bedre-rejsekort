"use server";

import { searchStations as searchRejseplanen } from "@/lib/rejseplanen";
import type { RejseplanenStation } from "@/lib/rejseplanen";

export interface SearchStationsResult {
  success: boolean;
  stations: RejseplanenStation[];
  error?: string;
}

/**
 * Server action to search for stations via Rejseplanen API
 */
export async function searchStations(query: string): Promise<SearchStationsResult> {
  if (!query || query.trim().length < 2) {
    return { success: true, stations: [] };
  }

  try {
    const stations = await searchRejseplanen(query.trim(), 10);
    return { success: true, stations };
  } catch (error) {
    console.error("Failed to search stations:", error);
    return {
      success: false,
      stations: [],
      error: error instanceof Error ? error.message : "Failed to search stations",
    };
  }
}

