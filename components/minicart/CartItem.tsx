import Image from "apps/website/components/Image.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Button from "$store/components/ui/Button.tsx";
import QuantitySelector from "$store/components/ui/QuantitySelector.tsx";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { sendEvent } from "$store/sdk/analytics.tsx";
import { Shopper } from "$store/sdk/userToShopperAnalytics.ts";

interface Props {
  index: number;
  shopper?: Shopper;
}

function CartItem({ index, shopper }: Props) {
  const { loading, cart, updateItems, mapItemsToAnalyticsItems } = useCart();
  const item = cart.value!.items[index];
  const locale = cart.value?.clientPreferencesData.locale;
  const currencyCode = cart.value?.storePreferencesData.currencyCode;
  const {
    imageUrl,
    skuName,
    sellingPrice,
    listPrice,
    name,
    quantity,
    bundleItems,
  } = item;
  const isGift = sellingPrice < 0.01;
  const newName = name!.split(" ").slice(0, -2).join(" ");
  const tamanho = name!.split(" ").slice(-1);
  return (
    <div class="flex flex-row justify-between items-start gap-4 min-h-[40px]">
      <Image
        src={imageUrl}
        alt={skuName}
        width={80}
        height={140}
        class="object-cover object-center"
      />

      <div class="flex-grow w-full leading-4">
        <span class="text-base text-black font-normal uppercase max-w-[150px] ">
          {newName}
        </span>
        <div class="flex items-start text-sm flex-col ">
          <span class="text-black text-base">
            Tamanho: {tamanho}
          </span>
          <span class="line-through  text-[#2f2f2f] text-sm ">
            {formatPrice(listPrice / 100, currencyCode!, locale)}
          </span>
          <span class="text-sm text-secondary">
            {isGift
              ? "Grátis"
              : formatPrice(sellingPrice / 100, currencyCode!, locale)}
          </span>
        </div>
        <div>
          <QuantitySelector
            disabled={loading.value || isGift}
            quantity={quantity}
            onChange={(quantity) => {
              updateItems({ orderItems: [{ index, quantity }] });
              const quantityDiff = quantity - item.quantity;

              if (!cart.value) return;

              sendEvent({
                name: quantityDiff < 0 ? "remove_from_cart" : "add_to_cart",
                params: {
                  currency: currencyCode,
                  shopper,
                  value: sellingPrice / 100,
                  order_form_id: cart.value.orderFormId,
                  items: mapItemsToAnalyticsItems({
                    items: [{
                      ...item,
                      quantity: Math.abs(quantityDiff),
                    }],
                    marketingData: cart.value.marketingData,
                  }),
                },
              });
            }}
          />
        </div>
      </div>
      <Button
        onClick={() => {
          updateItems({ orderItems: [{ index, quantity: 0 }] });
          if (!cart.value) return;
          sendEvent({
            name: "remove_from_cart",
            shopper,
            order_form_id: cart.value.orderFormId,
            params: {
              currency: currencyCode,
              items: mapItemsToAnalyticsItems({
                items: [item],
                marketingData: cart.value.marketingData,
              }),
            },
          });
        }}
        disabled={loading.value || isGift}
        // loading={loading.value}
        class="btn btn-ghost"
        aria-label="trash"
      >
        <Icon id="Trash" width={20} height={20} />
      </Button>
    </div>
  );
}

export default CartItem;
