import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";
import type { Product } from "apps/commerce/types.ts";
import AddToCartAvatar from "$store/components/product/AddToCartAvatar.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import { useState } from "preact/hooks";
import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";
import { mapUserToShopperAnalytics } from "$store/sdk/userToShopperAnalytics.ts";

interface Props {
  product: Product;
}

function VariantSelector(
  { product }: Props,
) {
  const { isVariantOf, productID } = product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant);
  const sizeObject = possibilities["Tamanho"] || {};
  const { user } = useUser();
  const shopper = user.value?.email
    ? mapUserToShopperAnalytics(user.value)
    : undefined;

  const variants = Object.keys(sizeObject).map((name) => {
    return {
      name,
      availability: sizeObject[name]?.availability,
      url: sizeObject[name]?.url,
      productID: sizeObject[name]?.productID,
    };
  });
  const sizes = ["4P", "3P", "PP", "P", "M", "G", "GG", "GGG", "3G", "4G", "U"];
  const orderedVariants = sizes.map((size) =>
    variants.find((sku) => sku.name === size)
  ).filter((item) => item !== undefined);
  const newVariants = orderedVariants.length > 0 ? orderedVariants : variants;

  const [visibleProduct] = useState(product);
  const [offer] = useState(useOffer(visibleProduct.offers));

  const { listPrice, price, seller } = offer;

  return (
    <ul class="flex items-center justify-center  w-full">
      {Object.keys(possibilities).map((name) => (
        <li class="flex flex-row flex-wrap  gap-2  justify-center  p-[0px] ">
          {newVariants.map((item) => (
            <AddToCartAvatar
              skuId={item?.productID || productID}
              sellerId={seller || ""}
              shopper={shopper}
              price={price ?? 0}
              discount={price && listPrice ? listPrice - price : 0}
              name={product.name ?? ""}
              category={product.category ?? ""}
              productGroupId={product.isVariantOf?.productGroupID ??
                ""}
              variant={item?.availability !== "https://schema.org/OutOfStock"
                ? "default"
                : "disabled"}
              content={item?.name!}
            />
          ))}
        </li>
      ))}
    </ul>
  );
}

export default VariantSelector;
