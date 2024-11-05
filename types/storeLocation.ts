export interface Address {
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string | null;
  reference: string | null;
  geoCoordinates: [number, number];
}

export interface BusinessHour {
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
}

export interface StoreLocation {
  id: string;
  name: string;
  instructions: string; // Garantir que seja sempre uma string
  distance: number;
  address: Address;
  businessHours: BusinessHour[];
}
