import { useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import { useUI } from "$store/sdk/useUI.ts";
import { sendEvent } from "deco-sites/fashion/sdk/analytics.tsx";
import { useSkuSelected } from "$store/sdk/useSkuSelected.ts";
import { mapProductCategoryToAnalyticsCategories } from "$store/sdk/productCategoryAnalytics.ts";
import { Shopper } from "$store/sdk/userToShopperAnalytics.ts";

export interface Options {
  skuId: string;
  sellerId?: string;
  price: number;
  discount: number;
  /**
   * sku name
   */
  name: string;
  productGroupId: string;
  category: string;
  shopper?: Shopper;
}

export const useAddToCart = (
  { skuId, sellerId, price, discount, name, productGroupId, category, shopper }:
    Options,
) => {
  const isAddingToCart = useSignal(false);
  const { displayCart } = useUI();
  const { addItems, cart } = useCart();
  const onClick = useCallback(async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const { skuSelected } = useSkuSelected();

    let cartObject = {
      skuId,
      sellerId,
      discount,
      price,
      productGroupId,
      name,
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
      };
    }

    if (!sellerId) {
      return;
    }

    try {
      isAddingToCart.value = true;

      await addItems({
        orderItems: [{ id: cartObject.skuId, seller: sellerId, quantity: 1 }],
      });

      sendEvent({
        name: "add_to_cart",
        params: {
          currency: "BRL",
          order_form_id: cart.value?.orderFormId,
          shopper,
          value: price,
          items: [{
            item_id: skuId,
            item_group_id: productGroupId,
            quantity: 1,
            price,
            discount,
            item_name: name,
            item_variant: name,
            ...mapProductCategoryToAnalyticsCategories(category),
          }],
        },
      });

      displayCart.value = true;
    } finally {
      isAddingToCart.value = false;
    }
  }, [skuId, sellerId]);

  return { onClick, loading: isAddingToCart.value };
};
