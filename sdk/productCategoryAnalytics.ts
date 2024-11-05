type CategoryLabel = "brand" | "department" | "subdepartment" | "subcategory";

export const mapProductCategoryToAnalyticsCategories = (category: string) => {
  const categories = category.split(">");
  const labels: CategoryLabel[] = [
    "brand",
    "department",
    "subdepartment",
    "subcategory",
  ];
  const res = categories.reduce(
    (result, category, index) => {
      const label = labels[index] || `category${index + 1}`;
      result[`${label}_name`] = category.trim();
      return result;
    },
    {} as Record<string, string>,
  );
  res.category_name = res.subcategory_name || res.subdepartment_name ||
    res.department_name || res.brand_name;
  return res;
};

export const mapCategoriesToAnalyticsCategories = (
  categories: string[],
): Record<`category${number | ""}_name`, string> => {
  const labels: CategoryLabel[] = [
    "brand",
    "department",
    "subdepartment",
    "subcategory",
  ];
  const res = categories.slice(0, 5).reduce(
    (result, category, index) => {
      const label = labels[index] || `category${index + 1}`;
      result[`${label}_name`] = category;
      return result;
    },
    {} as Record<string, string>,
  );
  res.category_name = res.subcategory_name || res.subdepartment_name ||
    res.department_name || res.brand_name;
  return res;
};
