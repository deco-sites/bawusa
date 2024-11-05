import AvatarCart from "$store/components/ui/AvatarCart.tsx";
import {
  Options as UseAddToCartProps,
  useAddToCart,
} from "$store/sdk/useAddToCart.ts";

export interface Props extends UseAddToCartProps {
  /**
   * @description Product id
   */
  sellerId: string;
  content: string;
  variant?: "active" | "disabled" | "default";
}

function AddToCartAvatar(
  {
    skuId,
    sellerId,
    discount,
    price,
    productGroupId,
    name,
    content,
    category,
    variant,
    shopper,
  }: Props,
) {
  const props = useAddToCart({
    skuId,
    sellerId,
    discount,
    price,
    productGroupId,
    name,
    category,
    shopper,
  });

  return (
    <AvatarCart
      data-deco="add-to-cart "
      content={content}
      variant={variant}
      {...props}
    />
  );
}

export default AddToCartAvatar;
