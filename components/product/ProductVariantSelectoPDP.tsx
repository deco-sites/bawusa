import Avatar from "$store/components/ui/Avatar.tsx";
import {
  Sku,
  useVariantPossibilities,
} from "$store/sdk/useVariantPossiblitiesClientSide.ts";
import type { Product } from "apps/commerce/types.ts";
import { useState } from "preact/hooks";
import { useProductSelected } from "$store/sdk/useProductSelected.ts";
import { useSkuSelected } from "$store/sdk/useSkuSelected.ts";

interface Props {
  product: Product;
  onSelect: (sku: Sku) => void;
}

function VariantSelector(
  { product, onSelect }: Props,
) {
  const { productSelected } = useProductSelected();
  const { skuSelected } = useSkuSelected();
  const sku = skuSelected.value;
  const chosen = productSelected.value;
  const { url, isVariantOf, productID, name } = chosen || product;
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant, isVariantOf?.name);
  const sizeObject = possibilities["Tamanho"] || {};
  const [selected, setSelected] = useState<string | null>(
    sku?.productID || productID,
  );
  setSelected(sku?.productID || productID);
  const variants = Object.keys(sizeObject).map((name) => {
    const ob = sizeObject[name];
    return {
      name,
      ...ob,
    } as Sku;
  });
  const sizes = ["4P", "3P", "PP", "P", "M", "G", "GG", "GGG", "3G", "4G", "U"];
  const orderedVariants = sizes.map((size) =>
    variants.find((sku) => sku.name === size)
  ).filter((item) => item !== undefined);
  const newVariants = orderedVariants.length > 0 ? orderedVariants : variants;

  return (
    <ul class="flex flex-col gap-4">
      {Object.keys(possibilities).map((name) => (
        <li class="flex flex-col gap-2">
          <span class="text-sm">{name}</span>
          <ul class="flex flex-row gap-3 justify-start max-h-[20px]">
            {newVariants.map((item) => (
              <li class="card-body card-actions m-0 max-w-[50px] max-h-[20px] items-center p-[0px]">
                <div
                  onClick={(e) => {
                    setSelected(item?.productID!);
                    onSelect(item!);
                  }}
                >
                  <Avatar
                    variant={item?.productID === selected
                      ? "active"
                      : (item?.availability !== "https://schema.org/OutOfStock"
                        ? "default"
                        : "disabled")}
                    content={item?.name!}
                    textSize="lg"
                  />
                </div>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export default VariantSelector;
