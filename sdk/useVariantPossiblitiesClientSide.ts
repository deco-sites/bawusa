import type {
  ImageObject,
  ItemAvailability,
  Product,
  ProductLeaf,
} from "apps/commerce/types.ts";
import { useOffer } from "$store/sdk/useOffer.ts";

export type Possibilities = Record<string, Record<string, Sku | undefined>>;
export type Sku = {
  name?: string;
  url?: string;
  productName?: string;
  availability: ItemAvailability;
  productID: string;
  description?: string;
  gtin?: string;
  offer: {
    price: number | undefined;
    listPrice: number | undefined;
    availability: ItemAvailability | undefined;
    seller: string | undefined;
    installments: string | null;
  };
  isSimilarTo?: Product[];
  image?: ImageObject[];
  priceCurrency?: string;
};

const omit = new Set(["category", "cluster", "RefId", "descriptionHtml"]);

export const mapProductToSku = (product: Product): Sku => {
  const {
    url,
    // additionalProperty = [],
    productID,
    offers,
    description,
    gtin,
    isSimilarTo,
    image,
    name,
  } = product;
  const traditionalOffer = offers?.offers.find((offer) => offer.seller === "1");
  const onDemandOffer = offers?.offers.find((offer) => offer.seller === "DMD");
  const olympikusOffer = offers?.offers.find((offer) => offer.seller === "OLY");
  const pacificOffer = offers?.offers.find((offer) =>
    offer.seller === "pacific"
  );
  const sellerOffer = onDemandOffer || olympikusOffer || pacificOffer ||
    traditionalOffer;
  const availability = sellerOffer!.availability;
  // const specs = additionalProperty.filter(({ name }) => !omit.has(name!));

  return {
    url,
    availability,
    productID,
    description,
    productName: name,
    gtin,
    isSimilarTo,
    image,
    priceCurrency: offers?.priceCurrency,
    offer: useOffer(product.offers),
  };
};

export const useVariantPossibilities = (
  variants: ProductLeaf[],
  originName?: string,
): Possibilities => {
  const possibilities: Possibilities = {};

  for (const variant of variants) {
    const {
      url,
      additionalProperty = [],
      productID,
      offers,
      description,
      gtin,
      isSimilarTo,
      image,
      name,
    } = variant;
    const variantName = name;
    const traditionalOffer = offers?.offers.find((offer) =>
      offer.seller === "1"
    );
    const onDemandOffer = offers?.offers.find((offer) =>
      offer.seller === "DMD"
    );
    const olympikusOffer = offers?.offers.find((offer) =>
      offer.seller === "OLY"
    );
    const pacificOffer = offers?.offers.find((offer) =>
      offer.seller === "pacific"
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

      possibilities[name][value] = {
        url,
        availability,
        productID,
        description,
        productName: originName || variantName,
        gtin,
        isSimilarTo,
        image,
        priceCurrency: offers?.priceCurrency,
        offer: useOffer(variant.offers),
      };
    }
  }

  return possibilities;
};
