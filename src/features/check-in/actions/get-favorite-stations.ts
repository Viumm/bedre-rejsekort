"use server";

import { db } from "@/lib/database";
import { favoriteStations } from "@/lib/database/schema";
import type { Station } from "../types";

/**
 * Get all favorite stations from the database
 */
export async function getFavoriteStations(): Promise<Station[]> {
  const result = await db.select().from(favoriteStations);
  
  return result.map((s) => ({
    id: s.id,
    name: s.name,
    extId: s.extId,
    municipality: s.municipality ?? undefined,
    coordinates: s.latitude && s.longitude
      ? { lat: s.latitude, lng: s.longitude }
      : undefined,
  }));
}

