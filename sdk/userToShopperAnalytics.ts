import { Person } from "apps/commerce/types.ts";

export type Shopper = {
  email: string;
  firstName?: string;
  familyName?: string;
  id?: string;
};

export const mapUserToShopperAnalytics = (
  user: Person,
): Shopper => {
  return {
    email: user.email!,
    firstName: user.givenName,
    familyName: user.familyName,
    id: user.identifier,
  };
};
