import { useSignal } from "@preact/signals";
import { Runtime } from "$store/runtime.ts";
import type { Product } from "apps/commerce/types.ts";
import type { JSX } from "preact";

interface Props {
  productID: Product["productID"];
}

const notifyme = Runtime.create("deco-sites/std/actions/vtex/notifyme.ts");

function Notify({ productID }: Props) {
  const loading = useSignal(false);

  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      loading.value = true;

      const name = (e.currentTarget.elements.namedItem("name") as RadioNodeList)
        ?.value;
      const email =
        (e.currentTarget.elements.namedItem("email") as RadioNodeList)?.value;

      await notifyme({ skuId: productID, name, email });
    } finally {
      loading.value = false;
    }
  };

  return (
    <form class="form-control justify-start gap-2" onSubmit={handleSubmit}>
      <span class="text-xl font-semibold">
        Este produto não está disponível no momento
      </span>
      <span class="text-base font-medium">
        Quero que me avisem quando estiver disponível
      </span>

      <input
        placeholder="Nome"
        class="input input-bordered  rounded-none border-2 max-w-[500px] px-2 h-[40px]   focus:outline-none"
        name="name"
      />
      <input
        placeholder="Email"
        class="input input-bordered  rounded-none border-2 max-w-[500px] px-2 h-[40px]   focus:outline-none"
        name="email"
      />

      <button
        class="btn max-w-[100px] max-h-[20px] p-1 rounded-none font-normal uppercase text-white bg-black disabled:loading"
        disabled={loading}
        aria-label={"Enviar"}
      >
        Enviar
      </button>
    </form>
  );
}

export default Notify;
