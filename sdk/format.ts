export const formatPrice = (
  price: number | undefined,
  currency = "BRL",
  locale = "pt-BR",
) => {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });

  if (!price) {
    return null;
  }

  return formatter.format(price);
};

export const formatDiscount = (price: number, listPrice: number) => {
  return Math.floor(((listPrice - price) / listPrice) * 100);
};
