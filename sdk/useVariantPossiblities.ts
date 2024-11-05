import type { ItemAvailability, ProductLeaf } from "apps/commerce/types.ts";

export type Possibilities = Record<string, Record<string, Sku | undefined>>;
type Sku = {
  url?: string;
  availability: ItemAvailability;
  productID: string;
};

const omit = new Set(["category", "cluster", "RefId", "descriptionHtml"]);

export const useVariantPossibilities = (
  variants: ProductLeaf[],
): Possibilities => {
  const possibilities: Possibilities = {};

  for (const variant of variants) {
    const { url, additionalProperty = [], productID, offers } = variant;
    const traditionalOffer = offers?.offers.find((offer) =>
      offer.seller === "1"
    );
    const onDemandOffer = offers?.offers.find((offer) =>
      offer.seller === "DMD"
    );
    const pacificOffer = offers?.offers.find((offer) =>
      offer.seller === "pacific"
    );
    const olympikusOffer = offers?.offers.find((offer) =>
      offer.seller === "OLY"
    );

    const sellerOffer = onDemandOffer || olympikusOffer || pacificOffer ||
      traditionalOffer;
    const availability = sellerOffer!.availability;
    const specs = additionalProperty.filter(({ name }) => !omit.has(name!));

    for (let it = 0; it < specs.length; it++) {
      const name = specs[it].name!;
      const value = specs[it].value!;

      if (omit.has(name)) continue;

      if (!possibilities[name]) {
        possibilities[name] = {};
      }

      possibilities[name][value] = { url, availability, productID };
    }
  }

  return possibilities;
};
