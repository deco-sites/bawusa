import { useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import { Runtime } from "$store/runtime.ts";
import { useCallback } from "preact/hooks";

function EmailField() {
  const { cart, loading } = useCart();
  const ref = useRef<HTMLInputElement>(null);
  const displayInput = useSignal(false);
  const email = useSignal("");

  if (cart.value?.clientProfileData?.email) {
    window.location.href = "/checkout#/profile";
  }

  const toggleInput = () => {
    displayInput.value = !displayInput.value;
  };

  const sendEmailToVtex = useCallback(async () => {
    loading.value = true;
    const data = await Runtime.invoke({
      key: "site/actions/sendClientEmail.ts",
      props: {
        email: ref.current?.value,
        orderFormId: cart.value?.orderFormId,
      },
    });
    window.location.href = "/checkout#/profile";
    loading.value = false;
  }, []);

  return (
    <div class="flex flex-col justify-between gap-2 p-2">
      <span class="text-md uppercase text-[#000000] text-left">
        Para finalizar sua compra, informe seu e-mail:
      </span>
      <span class="text-md uppercase font-bold text-[#000000] text-left">
        Rápida, Fácil e Seguro
      </span>
      <form
        class={`flex gap-2 bg-white rounded-none w-full border-b border-black`}
      >
        {loading.value && <span class="text-md my-2">Identificando...</span>}
        <input
          style={{ "background-color": "white" }}
          class="flex-grow input w-[70%] md:w-[85%] input-primary h-[40px] focus:outline-none border-none"
          name="email"
          ref={ref}
          type="text"
          value={cart.value?.clientProfileData?.email ?? ""}
          disabled={loading.value}
          placeholder={"Digite seu e-mail"}
        />
        <button
          class="bg-transparent border-none w-[30%] md:w-[15%] text-center px-2 md:px-5 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            sendEmailToVtex();
          }}
          aria-label={"text-black"}
        >
          <span class="text-black md:hidden flex">CONTINUAR</span>
          <Icon
            class="text-black hidden md:flex"
            width={20}
            height={20}
            id={loading.value ? "XMark" : ">"}
            strokeWidth={1}
          />
        </button>
      </form>
      <span class="text-sm text-[#a2a2a2]">
        Confirme seu e-mail, nós o utilizamos para:
      </span>
      <span class="text-sm text-[#a2a2a2]">
        <ul>
          <li>Identificar seu perfil</li>
          <li>Notificar sobre o andamento do seu pedido</li>
          <li>Gerenciar seu histórico de compras</li>
          <li>Acelerar o preenchimento de suas informações</li>
        </ul>
      </span>
    </div>
  );
}

export default EmailField;
