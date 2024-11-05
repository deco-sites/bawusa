import { Product } from "apps/commerce/types.ts";
import { useUI } from "../../sdk/useUI.ts";
import ProductCard from "./ProductCard.tsx";

export interface Columns {
  mobile?: number;
  desktop?: number;
}

export interface Props {
  products: Product[] | null;
  colorRed?: boolean;
}

function ProductGallery({ products, colorRed }: Props) {
  const { listingType } = useUI();

  if (listingType.value === "2") {
    return (
      <div class=" grid grid-cols-2 gap-2 sm:gap-8 lg:grid-cols-2">
        {products?.map((product, index) => (
          <ProductCard product={product} preload={true} colorRed={colorRed} />
        ))}
      </div>
    );
  } else if (listingType.value === "4") {
    return (
      <div class=" grid grid-cols-2 gap-2 sm:gap-8 lg:grid-cols-4">
        {products?.map((product, index) => (
          <ProductCard product={product} preload={true} colorRed={colorRed} />
        ))}
      </div>
    );
  } else {
    return (
      <div class=" grid grid-cols-2 gap-2 sm:gap-8 lg:grid-cols-6">
        {products?.map((product, index) => (
          <ProductCard product={product} preload={true} />
        ))}
      </div>
    );
  }
}

export default ProductGallery;
