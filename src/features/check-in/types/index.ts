export interface Station {
  id: string;
  name: string;
  municipality?: string;
  /** Rejseplanen external ID */
  extId?: string;
  /** Coordinates from Rejseplanen */
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Passenger {
  id: string;
  name: string;
  fullName: string;
  birthDate: string;
  type: "Child" | "Young person" | "Adult" | "Senior";
  travelClass: "Standard" | "First class";
}

/**
 * Calculate age from birth date string (DD.MM.YYYY format)
 */
export function calculateAge(birthDate: string): number {
  const [day, month, year] = birthDate.split(".").map(Number);
  const birth = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

/**
 * Determine passenger type based on age (Rejsekort rules)
 * - 0-15: Child (børn)
 * - 16-25: Young person (ung)
 * - 26-64: Adult (voksen)
 * - 65+: Senior (pensionist)
 */
export function getPassengerTypeFromAge(age: number): {
  type: "child" | "young_person" | "adult" | "senior";
  displayType: Passenger["type"];
} {
  if (age < 16) {
    return { type: "child", displayType: "Child" };
  } else if (age <= 25) {
    return { type: "young_person", displayType: "Young person" };
  } else if (age < 65) {
    return { type: "adult", displayType: "Adult" };
  } else {
    return { type: "senior", displayType: "Senior" };
  }
}

/**
 * Get passenger type from birth date
 */
export function getPassengerTypeFromBirthDate(birthDate: string): {
  type: "child" | "young_person" | "adult" | "senior";
  displayType: Passenger["type"];
} {
  const age = calculateAge(birthDate);
  return getPassengerTypeFromAge(age);
}

export interface ActiveTicket {
  ticketId: string;
  station: Station;
  passenger: Passenger;
  validFrom: Date;
}

