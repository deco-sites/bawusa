import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { sendEvent, SendEventOnView } from "$store/sdk/analytics.tsx";
import CartItem from "./CartItem.tsx";
import Coupon from "./Coupon.tsx";
import SellerCoupon from "./SellerCoupon.tsx";
import EmailField from "./EmailField.tsx";
import FreeShippingProgressBar from "./FreeShippingProgressBar.tsx";
import { useId } from "preact/hooks";
import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";
import { mapUserToShopperAnalytics } from "$store/sdk/userToShopperAnalytics.ts";
import { useCallback } from "preact/hooks";
import { Runtime } from "$store/runtime.ts";
import { useSignal } from "@preact/signals";
import Icon from "$store/components/ui/Icon.tsx";
import { useUI } from "$store/sdk/useUI.ts";

function Cart() {
  const { cart, loading, mapItemsToAnalyticsItems } = useCart();
  const { displayCart } = useUI();

  const { user } = useUser();
  const displayInput = useSignal(false);
  const shopper = user.value?.email
    ? mapUserToShopperAnalytics(user.value)
    : undefined;
  const isCartEmpty = cart.value?.items.length === 0;
  const total = cart.value?.totalizers.find((item) => item.id === "Items");
  const totalizers = cart.value?.totalizers;
  const total2 = totalizers?.find((item) => item.id === "Items")?.value || 0;

  const locale = cart.value?.clientPreferencesData.locale;
  const currencyCode = cart.value?.storePreferencesData.currencyCode;
  if (cart.value === null) {
    return null;
  }

  let total3 = 0;
  let discount = 0;

  cart.value.items.forEach((item) =>
    discount += item.priceTags[0] ? (item.priceTags[0].value) : (0)
  );

  cart.value.items.forEach((item) => total3 += item.priceDefinition.total);
  const subTotal = total3 + (discount * -1);
  const id = useId();

  const showOnlyEmailField = function (state: boolean) {
    displayInput.value = state;
  };

  const getProfileByEmailClick = useCallback(async (e: MouseEvent) => {
    const body = {
      email: "riquegonsalves@gmail.com",
      orderFormId: cart.value?.orderFormId,
    };
    const data = await Runtime.invoke({
      key: "site/actions/sendClientEmail.ts",
      props: body,
    });
  }, []);

  // Empty State

  if (isCartEmpty) {
    return (
      <>
        <div class="flex flex-col items-start flex-grow">
          <header class="flex py-2 justify-between items-center w-full text-white bg-black text-sm">
            <div class="w-full flex flex-col justify-between items-center">
              <div class="flex flex-row w-full items-center content-start">
                <div class="px-2 py-4 w-full">
                  <FreeShippingProgressBar
                    total={total3 / 100}
                    target={299}
                    locale={locale!}
                    currency={currencyCode!}
                  />
                </div>
              </div>
            </div>
          </header>
          <div
            id={id}
            class="flex flex-col justify-center items-center  h-[200px] gap-6 w-full"
          >
            <span class="font-medium text-base uppercase text-[#a2a2a2]">
              {"Seu carrinho está vazio :("}
            </span>
            <span
              onClick={() => {
                displayCart.value = false;
              }}
              class="font-medium text-base uppercase"
            >
              continue comprando
            </span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {displayInput.value === true
        ? (
          <>
            <div class="flex flex-col items-start flex-grow">
              <header class="flex py-2 justify-between w-full text-white bg-black text-sm">
                <div class="w-full flex flex-col justify-between items-center">
                  <div class="flex flex-row w-full items-center content-start">
                    <div class="px-2 py-2 w-full text-center">
                      <Icon
                        id="LogoBawCart"
                        height={21}
                        width={255}
                        style={{ margin: "0 auto" }}
                      />
                    </div>
                  </div>
                </div>
              </header>
              <div class="mt-6 p-2 max-h-[45vh] w-full flex-grow overflow-y-auto flex flex-col gap-6 ">
                <EmailField />
              </div>
            </div>
          </>
        )
        : (
          <>
            <div class="flex flex-col justify-between flex-grow">
              <header class="flex py-2 justify-between items-center text-white bg-black text-sm">
                <div class="w-full flex flex-col justify-between items-center">
                  <div class="flex flex-row w-full items-center content-start">
                    <div class="px-2 py-2 w-full">
                      <FreeShippingProgressBar
                        total={total3 / 100}
                        target={299}
                        locale={locale!}
                        currency={currencyCode!}
                      />
                    </div>
                  </div>
                </div>
              </header>
              {/* Cart Items */}
              <ul
                role="list"
                class="mt-6 p-2 max-h-[45vh] flex-grow overflow-y-auto flex flex-col gap-6 "
                id={id}
              >
                {cart.value.items.map((_, index) => (
                  <li>
                    <CartItem index={index} key={index} shopper={shopper} />
                  </li>
                ))}
              </ul>

              {/* Cart Footer */}
              <footer>
                <div class="border-t border-base-200 py-2 flex flex-col gap-2 bg-[#f4f4f4]">
                  <SellerCoupon />
                </div>
                <div class="py-2 flex flex-col gap-2 bg-[#f4f4f4]">
                  <Coupon />
                </div>
                {/* Subtotal */}
                {subTotal > 0 && (
                  <div class="pt-4 flex flex-col justify-end items-end gap-1 mx-2">
                    <div class="flex justify-between items-center w-full">
                      <span class="text-base uppercase">Subtotal</span>
                      <span class="font-medium text-base uppercase ">
                        {formatPrice(subTotal / 100, currencyCode!, locale)}
                      </span>
                    </div>
                  </div>
                )}
                {/* Descontos */}
                {discount != 0 && (
                  <div class="pt-1 flex flex-col justify-end items-end gap-1 mx-2">
                    <div class="flex justify-between items-center w-full">
                      <span class="text-base uppercase">Descontos</span>
                      <span class="font-medium text-base uppercase ">
                        {formatPrice(discount / 100, currencyCode!, locale)}
                      </span>
                    </div>
                  </div>
                )}
                {/* Total */}
                {total3 > 0 && (
                  <div class="pt-1 flex flex-col justify-end items-end gap-1 mx-2">
                    <div class="flex justify-between items-center w-full">
                      <span class="text-base uppercase">Total</span>
                      <span class="font-medium text-base uppercase ">
                        {formatPrice(total3 / 100, currencyCode!, locale)}
                      </span>
                    </div>
                  </div>
                )}
                <div class="p-4 flex">
                  <a class="inline-block w-full" href="#">
                    <button
                      data-deco="buy-button "
                      aria-label="checkout"
                      class="w-full font-bold py-2 uppercase bg-green-500 border-none rounded-none text-white hover:bg-green-700"
                      disabled={loading.value || cart.value.items.length === 0}
                      onClick={(e) => {
                        if (cart.value?.orderFormId) {
                          window.location.href = "/checkout#/cart";
                        } else {
                          showOnlyEmailField(true);
                        }
                        sendEvent({
                          name: "begin_checkout",
                          params: {
                            order_form_id: cart.value?.orderFormId,
                            currency: cart.value ? currencyCode! : "",
                            value: total?.value
                              ? (total3 - (discount ?? 0)) / 100
                              : 0,
                            coupon: cart.value?.marketingData?.coupon ??
                              undefined,
                            shopper,
                            items: cart.value
                              ? mapItemsToAnalyticsItems(cart.value)
                              : [],
                          },
                        });
                      }}
                    >
                      Finalizar Compra
                    </button>
                  </a>
                </div>
              </footer>
              <SendEventOnView
                id={id}
                event={{
                  name: "view_cart",
                  params: {
                    currency: cart.value ? currencyCode! : "",
                    order_form_id: cart.value?.orderFormId,
                    coupon: cart.value?.marketingData?.coupon ?? undefined,
                    shopper,
                    value: total?.value ? (total3 - (discount ?? 0)) / 100 : 0,
                    items: cart.value
                      ? mapItemsToAnalyticsItems(cart.value)
                      : [],
                  },
                }}
              />
            </div>
          </>
        )}
    </>
  );
}

export default Cart;
