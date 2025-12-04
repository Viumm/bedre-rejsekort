export interface Station {
  id: string;
  name: string;
  municipality: string;
}

export interface Passenger {
  name: string;
  fullName: string;
  birthDate: string;
  age: number;
  type: "Young person" | "Adult" | "Senior";
  travelClass: "Standard" | "First class";
}

export interface ActiveTicket {
  ticketId: string;
  station: Station;
  passenger: Passenger;
  validFrom: Date;
}

