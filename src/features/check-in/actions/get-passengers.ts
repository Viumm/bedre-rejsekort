"use server";

import { db } from "@/lib/database";
import { passengers } from "@/lib/database/schema";
import type { Passenger } from "../types";

/**
 * Get all passengers from the database
 */
export async function getPassengers(): Promise<Passenger[]> {
  const result = await db.select().from(passengers);
  
  return result.map((p) => ({
    id: p.id,
    name: p.name,
    fullName: p.fullName,
    birthDate: p.birthDate,
    type: mapPassengerType(p.type),
    travelClass: mapTravelClass(p.travelClass),
  }));
}

function mapPassengerType(type: string): Passenger["type"] {
  switch (type) {
    case "child":
      return "Child";
    case "young_person":
      return "Young person";
    case "senior":
      return "Senior";
    default:
      return "Adult";
  }
}

function mapTravelClass(travelClass: string): Passenger["travelClass"] {
  return travelClass === "first_class" ? "First class" : "Standard";
}

