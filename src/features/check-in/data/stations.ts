import type { Station, Passenger } from "../types";

export const STATIONS: Station[] = [
  {
    id: "godthaabsvej",
    name: "Godthåbsvej",
    municipality: "Silkeborg Kom",
  },
  {
    id: "buskelundvaenget",
    name: "Buskelundvænget/V. Højmarksvej",
    municipality: "Silkeborg Kom",
  },
];

export const PASSENGERS: Passenger[] = [
  {
    name: "Lucas",
    fullName: "Lucas Vium",
    birthDate: "15.09.2004",
    age: 21,
    type: "Young person",
    travelClass: "Standard",
  },
  {
    name: "Anders",
    fullName: "Anders Würtz",
    birthDate: "23.07.2005",
    age: 20,
    type: "Young person",
    travelClass: "Standard",
  },
];

export const DEFAULT_PASSENGER: Passenger = PASSENGERS[0];

