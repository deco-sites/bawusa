import { AppContext } from "$live/mod.ts";
interface Props {
  stateUf: string;
}
interface GraphQLAddress {
  postalCode: string;
  city: string;
  state: string;
  neighborhood: string;
  street: string;
  number: string;
  complement: string;
  reference: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
interface GraphQLBusinessHour {
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
}
interface GraphQLStoreLocation {
  id: string;
  name: string;
  instructions: string;
  distance: number;
  address: GraphQLAddress;
  businessHours: GraphQLBusinessHour[];
}
export interface StoreLocation {
  id: string;
  name: string;
  instructions: string | null;
  distance: number;
  address: Address;
  businessHours: BusinessHour[];
}
interface Address {
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
interface BusinessHour {
  dayOfWeek: number;
  openingTime: string;
  closingTime: string;
}

const QUERY = `
  query getStoresLocation(
      $latitude: Float,
      $longitude: Float,
      $keyword: String,
    ) {
      getStores(
        longitude: $longitude,
        latitude: $latitude,
        keyword: $keyword
      ) {
        items {
          id
          name
          instructions
          distance
          address {
            postalCode
            city
            state
            neighborhood
            street
            number
            complement
            reference
            location {
              latitude
              longitude
            }
          }
          businessHours {
            dayOfWeek
            openingTime
            closingTime
          }
        }
      }
    }  
`;

export default async function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Promise<StoreLocation[]> {
  const { io } = ctx;
  const { getStores } = await io.query<
    { getStores: { items: GraphQLStoreLocation[] } },
    Props
  >({
    query: QUERY,
    variables: {
      keyword: props.stateUf,
    },
  });

  return getStores.items.map((item: GraphQLStoreLocation) => ({
    id: item.id,
    name: item.name,
    instructions: item.instructions,
    distance: item.distance,
    address: {
      postalCode: item.address.postalCode,
      city: item.address.city,
      state: item.address.state,
      neighborhood: item.address.neighborhood,
      street: item.address.street,
      number: item.address.number,
      complement: item.address.complement,
      reference: item.address.reference,
      geoCoordinates: [
        item.address.location.longitude,
        item.address.location.latitude,
      ],
    },
    businessHours: item.businessHours.map((hour: GraphQLBusinessHour) => ({
      dayOfWeek: hour.dayOfWeek,
      openingTime: hour.openingTime,
      closingTime: hour.closingTime,
    })),
  })) ?? [];
}
