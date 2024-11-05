import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { Runtime } from "$store/runtime.ts";

function SellerCoupon() {
  const { cart, loading } = useCart();
  const ref = useRef<HTMLInputElement>(null);
  const displayInput = useSignal(false);
  const coupon = cart.value?.marketingData?.coupon ?? "" as string;
  const utmiCampaign = cart.value?.marketingData?.utmiCampaign ?? "" as string;
  const utmCampaign = cart.value?.marketingData?.utmCampaign;
  const orderFormId = cart.value?.orderFormId;
  const [alertMessage, setAlertMessage] = useState("");

  const toggleInput = () => {
    displayInput.value = !displayInput.value;
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  const removeCouponFromCart = useCallback(async (e: MouseEvent) => {
    e.preventDefault();

    //Removve cookie sellerCoupon
    document.cookie =
      "sellerCoupon=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    //Remove parametro da UR
    const url = new URL(window.location.href);
    url.searchParams.delete("addCoupon");
    window.history.replaceState({}, "", url.href);

    const text = ref.current?.value;

    if (text && orderFormId) {
      const data = await Runtime.invoke({
        key: "site/actions/removeCouponInOrderForm.ts",
        props: {
          orderFormId,
          coupon: text,
        },
      });

      cart.value = data;

      toggleInput();
    }
  }, [ref.current?.value, orderFormId]);

  const applyUrlCoupon = useCallback(async () => {
    const paramCoupon = new URLSearchParams(window.location.search);
    //get coupon from cookie name sellerCoupon
    const cookieCoupon = document.cookie.split(";").find((item) =>
      item.trim().startsWith("sellerCoupon=")
    );

    if (paramCoupon.has("addCoupon") || cookieCoupon) {
      // Obtém o valor do parâmetro addCoupon
      const couponValue = paramCoupon.get("addCoupon") ||
        cookieCoupon?.split("=")[1];

      if (couponValue && orderFormId) {
        const data = await Runtime.invoke({
          key: "site/actions/putCouponInOrderForm.ts",
          props: {
            coupon: couponValue.toUpperCase(),
            typeField: "seller",
            oldOrderForm: cart.value,
          },
        });

        if (data && data.hasError) {
          showAlert(data.data);
          return;
        }

        if (data && data.infoMessage) {
          showAlert(data.infoMessage);
        }

        if (data) {
          cart.value = data.data;
        }
      } else {
        showAlert("Digite um cupom válido");
      }
    }
  }, [orderFormId, ref.current?.value]);

  const applyCouponToCart = useCallback(async (e: MouseEvent) => {
    e.preventDefault();

    const text = ref.current?.value;

    if (text && orderFormId) {
      const data = await Runtime.invoke({
        key: "site/actions/putCouponInOrderForm.ts",
        props: {
          coupon: text.toUpperCase(),
          typeField: "seller",
          oldOrderForm: cart.value,
        },
      });

      if (data && data.hasError) {
        showAlert(data.data);
        return;
      }

      if (data && data.infoMessage) {
        showAlert(data.infoMessage);
      }

      if (data) {
        cart.value = data.data;
      }

      toggleInput();
    } else {
      showAlert("Digite um cupom válido");
    }
  }, [orderFormId, ref.current?.value]);

  useEffect(() => {
    applyUrlCoupon();
  }, [applyUrlCoupon]);

  const cookieCoupon = document.cookie.split(";").find((item) =>
    item.trim().startsWith("sellerCoupon=")
  );

  return (
    <div
      class={`flex flex-col justify-between items-center gap-2 px-4 py-2 bg-[#f4f4f4]`}
    >
      <span class="text-sm uppercase font-bold text-[#a2a2a2]">
        Cupom de vendedor
      </span>
      <form
        class={`flex gap-2 ${
          utmiCampaign.length > 0 ? "bg-[#f4f4f4]" : "bg-white"
        } rounded-none w-full border-b border-black`}
      >
        <input
          style={utmiCampaign
            ? { "background-color": "#f4f4f4" }
            : { "background-color": "white" }}
          class="flex-grow input w-[85%] input-primary h-[40px] focus:outline-none border-none"
          name="coupon"
          ref={ref}
          type="text"
          value={(utmiCampaign.length && utmiCampaign !== "CodigoVendedor")
            ? utmiCampaign
            : (utmiCampaign === "CodigoVendedor" && utmCampaign?.length &&
                utmCampaign === coupon
              ? coupon
              : "")}
          disabled={Boolean(utmiCampaign.length || utmCampaign?.length)}
          placeholder={"Insira o código"}
        />

        {utmiCampaign.length === 0 && (
          <button
            class="bg-transparent border-none w-[15%] text-center px-5"
            disabled={loading}
            onClick={applyCouponToCart}
            aria-label={"text-black"}
          >
            <Icon
              class="text-black"
              width={24}
              height={24}
              id="ChevronRight"
              strokeWidth={1}
            />
          </button>
        )}

        {utmiCampaign.length > 0 && (
          <button
            class="bg-transparent border-none w-[15%] text-center pr-6"
            disabled={loading}
            onClick={removeCouponFromCart}
            aria-label={"remover"}
          >
            <span>remover</span>
          </button>
        )}
      </form>
      {alertMessage && (
        <div class="w-full text-gray-500 text-center font-bold py-2 px-4">
          {alertMessage}
        </div>
      )}
    </div>
  );
}

export default SellerCoupon;
