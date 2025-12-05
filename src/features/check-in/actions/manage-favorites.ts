"use server";

import { db } from "@/lib/database";
import { favoriteStations } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Station } from "../types";

/**
 * Add a station to favorites and return the created record
 */
export async function addFavoriteStation(station: Station) {
  const extId = station.extId || station.id;
  
  // Check if already exists
  const existing = await db.select()
    .from(favoriteStations)
    .where(eq(favoriteStations.extId, extId));

  if (existing.length > 0) {
    return { success: false, error: "Station er allerede i favoritter", station: existing[0] };
  }

  const result = await db.insert(favoriteStations).values({
    name: station.name,
    extId: extId,
    municipality: station.municipality,
    latitude: station.coordinates?.lat,
    longitude: station.coordinates?.lng,
  }).returning();

  revalidatePath("/");
  return { success: true, station: result[0] };
}

/**
 * Remove a station from favorites by extId
 */
export async function removeFavoriteStation(extId: string) {
  await db.delete(favoriteStations).where(eq(favoriteStations.extId, extId));
  revalidatePath("/");
  return { success: true };
}

/**
 * Check if a station is a favorite
 */
export async function isFavoriteStation(extId: string): Promise<boolean> {
  const result = await db.select()
    .from(favoriteStations)
    .where(eq(favoriteStations.extId, extId));
  
  return result.length > 0;
}
