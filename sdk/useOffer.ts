import type {
  AggregateOffer,
  UnitPriceSpecification,
} from "apps/commerce/types.ts";

const bestInstallment = (
  acc: UnitPriceSpecification | null,
  curr: UnitPriceSpecification,
) => {
  if (curr.priceComponentType !== "https://schema.org/Installment") {
    return acc;
  }

  if (!acc) {
    return curr;
  }

  if (acc.price > curr.price) {
    return curr;
  }

  if (acc.price < curr.price) {
    return acc;
  }

  if (
    acc.billingDuration && curr.billingDuration &&
    acc.billingDuration < curr.billingDuration
  ) {
    return curr;
  }

  return acc;
};

const installmentToString = (
  installment: UnitPriceSpecification,
  sellingPrice: number,
) => {
  const { billingDuration, billingIncrement, price } = installment;

  if (!billingDuration || !billingIncrement) {
    return "";
  }

  const withTaxes = sellingPrice < price;

  return `${billingDuration}x de R$ ${billingIncrement} ${
    withTaxes ? "com juros" : "sem juros"
  }`;
};

export const useOffer = (aggregateOffer?: AggregateOffer) => {
  const offerBySeller = (seller: string) => {
    return aggregateOffer?.offers.filter((offer) =>
      offer.availability === "https://schema.org/InStock"
    ).find((offer) => offer.seller === seller);
  };

  const offer = (() => {
    const onDemandOffer = offerBySeller("DMD");
    if (onDemandOffer) return onDemandOffer;

    const pacificOffer = offerBySeller("pacific");
    if (pacificOffer) return pacificOffer;

    const olympikusOffer = offerBySeller("OLY");
    if (olympikusOffer) return olympikusOffer;

    return offerBySeller("1");
  })();

  const listPrice = offer?.priceSpecification.find((spec) =>
    spec.priceType === "https://schema.org/ListPrice"
  );
  const installment = offer?.priceSpecification.reduce(bestInstallment, null);
  const seller = offer?.seller;
  const price = offer?.price;
  const availability = offer?.availability;

  return {
    price,
    listPrice: listPrice?.price,
    priceSpecification: offer?.priceSpecification,
    availability,
    seller,
    installments: installment && price
      ? installmentToString(installment, price)
      : null,
  };
};
