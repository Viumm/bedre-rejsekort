"use server";

import { db } from "@/lib/database";
import { passengers } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

interface CreatePassengerInput {
  name: string;
  fullName: string;
  birthDate: string; // Format: DD.MM.YYYY
  type: "child" | "young_person" | "adult" | "senior";
  travelClass: "standard" | "first_class";
}

/**
 * Create a new passenger
 */
export async function createPassenger(input: CreatePassengerInput) {
  const result = await db.insert(passengers).values({
    name: input.name,
    fullName: input.fullName,
    birthDate: input.birthDate,
    type: input.type,
    travelClass: input.travelClass,
  }).returning();

  revalidatePath("/");
  return result[0];
}

/**
 * Delete a passenger by ID
 */
export async function deletePassenger(id: string) {
  await db.delete(passengers).where(eq(passengers.id, id));
  revalidatePath("/");
}

/**
 * Update a passenger
 */
export async function updatePassenger(id: string, input: Partial<CreatePassengerInput>) {
  const result = await db.update(passengers)
    .set({
      ...input,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(passengers.id, id))
    .returning();

  revalidatePath("/");
  return result[0];
}

