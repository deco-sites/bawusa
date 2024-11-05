export const mapCategoriesToAnalyticsCategories = (
  categories: string[],
): Record<`category${number | ""}_name`, string> => {
  const reversedCategories = [...categories].reverse();
  return reversedCategories.slice(0, 5).reduce(
    (result, category, index) => {
      result[`category${index === 0 ? "" : index + 1}_name`] = category;
      return result;
    },
    {} as Record<`category${number | ""}_name`, string>,
  );
};
