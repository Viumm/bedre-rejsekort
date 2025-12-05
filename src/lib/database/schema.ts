import { pgTable, uuid, text, timestamp, doublePrecision, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const passengerType = pgEnum("passenger_type", ['child', 'young_person', 'adult', 'senior'])
export const travelClass = pgEnum("travel_class", ['standard', 'first_class'])


export const passengers = pgTable("passengers", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	fullName: text("full_name").notNull(),
	birthDate: text("birth_date").notNull(),
	type: passengerType().default('adult').notNull(),
	travelClass: travelClass("travel_class").default('standard').notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const favoriteStations = pgTable("favorite_stations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	extId: text("ext_id").notNull(),
	municipality: text(),
	latitude: doublePrecision(),
	longitude: doublePrecision(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
