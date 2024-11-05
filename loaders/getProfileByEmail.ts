import { fetchAPI } from "deco-sites/std/utils/fetch.ts";

export interface PropsLoad {
  email: string;
}

export interface ProfileResponse {
  userProfileId: string;
  profileProvider?: string;
  availableAccounts?: Account[];
  availableAddresses?: Address[];
  userProfile?: UserProfile;
  isComplete: boolean;
}

interface Account {
  id: string;
  email: string;
  provider: string;
  isDefault: boolean;
}

interface Address {
  addressType?: string;
  receiverName?: string;
  addressId?: string;
  isDisposable?: string;
  postalCode?: string;
  city?: string;
  state?: string;
  country?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  complement?: string;
  reference?: string;
  geoCoordinates?: string;
}

interface UserProfile {
  email?: string;
  firstName?: string;
  lastName?: string;
  document?: string;
  documentType?: string;
  phone?: string;
  corporateName?: string;
  tradeName?: string;
  corporateDocument?: string;
  stateInscription?: string;
  corporatePhone?: string;
  isCorporate?: boolean;
  profileCompleteOnLoading?: string;
  profileErrorOnLoading?: string;
  customerClass?: string;
}

const url =
  "https://bawclothing.vtexcommercestable.com.br/api/checkout/pub/profiles";

// mocking specific product to test with reviews
// /sweatshirt-logo-azul-0070430005/p
// let productId = "1944875713";

const loader = async (
  props: PropsLoad,
): Promise<ProfileResponse | null> => {
  let email = "";
  // console.log({ propsProductId: props.productId });
  if (props.email) {
    email = props.email;
  }

  try {
    const r = await fetchAPI<ProfileResponse>(
      url + "?email=" + email,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
      },
    );

    console.log({ r });
    return r;
  } catch (e) {
    console.log({ err: e });
    return null;
  }
};

export default loader;
