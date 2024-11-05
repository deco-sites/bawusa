import { fetchAPI } from "deco-sites/std/utils/fetch.ts";

export interface Props {
  storeCep: string;
}
export interface CEPAddress {
  addressType: string;
  receiverName: string | null;
  addressId: string;
  isDisposable: boolean;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string | null;
  reference: string | null;
  geoCoordinates: [number, number];
}

export interface CEPBusinessHour {
  DayOfWeek: number;
  OpeningTime: string;
  ClosingTime: string;
}

export interface CEPStoreLocation {
  distance: number;
  pickupPoint: {
    friendlyName: string;
    address: CEPAddress;
    additionalInfo: string | null;
    id: string;
    businessHours: CEPBusinessHour[];
  };
}

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
  instructions: string | null;
  distance: number;
  address: Address;
  businessHours: BusinessHour[];
}
interface ResponseData extends Response {
  items: CEPStoreLocation[];
}

const URL_API =
  "https://bawclothing.vtexcommercestable.com.br/api/checkout/pub/pickup-points";

const loader = async ({ storeCep }: Props): Promise<StoreLocation[]> => {
  try {
    const response = await fetchAPI(
      `${URL_API}/?postalCode=${storeCep}&countryCode=BRA`,
    ) as ResponseData;

    if (response.status === 404) {
      return [];
    }
    const data = response.items;

    return data.map((item: CEPStoreLocation) => ({
      id: item.pickupPoint.address.addressId,
      name: item.pickupPoint.friendlyName,
      instructions: item.pickupPoint.additionalInfo,
      distance: item.distance,
      address: {
        postalCode: item.pickupPoint.address.postalCode,
        city: item.pickupPoint.address.city,
        state: item.pickupPoint.address.state,
        neighborhood: item.pickupPoint.address.neighborhood,
        street: item.pickupPoint.address.street,
        number: item.pickupPoint.address.number,
        complement: item.pickupPoint.address.complement,
        reference: item.pickupPoint.address.reference,
        geoCoordinates: item.pickupPoint.address.geoCoordinates,
      },
      businessHours: item.pickupPoint.businessHours.map((
        hour: CEPBusinessHour,
      ) => ({
        dayOfWeek: hour.DayOfWeek,
        openingTime: hour.OpeningTime,
        closingTime: hour.ClosingTime,
      })),
    })) ?? [];
  } catch (e) {
    console.log({ err: e });
    return [];
  }
};

export default loader;
