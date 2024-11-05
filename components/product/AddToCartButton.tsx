import Button from "$store/components/ui/Button.tsx";
import {
  Options as UseAddToCartProps,
  useAddToCart,
} from "$store/sdk/useAddToCart.ts";
import { useSkuSelected } from "$store/sdk/useSkuSelected.ts";
export interface Props extends UseAddToCartProps {
  /**
   * @description Product id
   */
  sellerId: string;
}

function AddToCartButton(
  { skuId, sellerId, discount, price, productGroupId, name, category }: Props,
) {
  const { skuSelected } = useSkuSelected();

  let cartObject = {
    skuId,
    sellerId,
    discount,
    price,
    productGroupId,
    name,
    category,
  };

  if (skuSelected.value !== null) {
    cartObject = {
      skuId: skuSelected.value?.productID,
      sellerId,
      discount:
        skuSelected.value.offer.price && skuSelected.value.offer.listPrice
          ? skuSelected.value.offer.listPrice - skuSelected.value.offer.price
          : 0,
      price: skuSelected.value.offer.price!,
      productGroupId,
      name: skuSelected.value.productName!,
      category,
    };
  }

  const props = useAddToCart(cartObject);

  return (
    <Button
      data-deco="add-to-cart "
      aria-label={"Adicionar à sacola"}
      {...props}
      class="w-[280px] text-white uppercase bg-[#00a95b] border-none rounded-none"
    >
      Adicionar à Sacola
    </Button>
  );
}

export default AddToCartButton;
