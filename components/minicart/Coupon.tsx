import { useCallback, useRef, useState } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import Icon from "$store/components/ui/Icon.tsx";
import { Runtime } from "$store/runtime.ts";

function Coupon() {
  const { cart, loading } = useCart();
  const ref = useRef<HTMLInputElement>(null);
  const displayInput = useSignal(false);
  const coupon = cart.value?.marketingData?.coupon ?? "";
  const utmiCampaign = cart.value?.marketingData?.utmiCampaign ?? "";
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

  const applyCouponToCart = useCallback(async (e: MouseEvent) => {
    e.preventDefault();

    const text = ref.current?.value;

    if (text && orderFormId) {
      const data = await Runtime.invoke({
        key: "site/actions/putCouponInOrderForm.ts",
        props: {
          coupon: text.toUpperCase(),
          typeField: "coupon",
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
  }, [ref.current?.value, orderFormId, utmCampaign, utmiCampaign]);

  return (
    <div class="flex flex-col justify-between items-center gap-2 px-4 py-2 bg-[#f4f4f4]">
      <span class="text-sm uppercase font-bold text-[#a2a2a2]">
        Cupom de desconto
      </span>
      <form
        class={`flex gap-2 ${
          coupon === utmiCampaign || coupon === utmCampaign
            ? "bg-white"
            : "bg-[#f4f4f4]"
        } rounded-none w-full border-b border-black`}
      >
        <input
          style={coupon === utmiCampaign || coupon === utmCampaign
            ? { backgroundColor: "white" }
            : { backgroundColor: "#f4f4f4" }}
          class="flex-grow input w-[85%] input-primary h-[40px] focus:outline-none border-none"
          name="coupon"
          ref={ref}
          type="text"
          value={coupon !== utmiCampaign && utmiCampaign !== "CodigoVendedor"
            ? coupon
            : ""}
          disabled={coupon !== utmiCampaign &&
            utmiCampaign !== "CodigoVendedor"}
          placeholder={"Insira o código"}
        />

        {Boolean(
          !coupon.length || coupon === utmiCampaign || coupon === utmCampaign,
        ) && (
          <button
            class="bg-transparent border-none w-[15%] text-center px-5"
            disabled={loading}
            onClick={applyCouponToCart}
            aria-label="text-black"
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

        {Boolean(
          coupon.length &&
            coupon !== utmiCampaign &&
            coupon !== utmCampaign,
        ) && (
          <button
            class="bg-transparent  border-none w-[15%]  text-center pr-6"
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

export default Coupon;
