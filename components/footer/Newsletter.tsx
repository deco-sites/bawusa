import { useSignal } from "@preact/signals";
import { Runtime } from "$store/runtime.ts";
import Icon from "$store/components/ui/Icon.tsx";

import type { JSX } from "preact";

const subscribe = Runtime.create(
  "deco-sites/std/actions/vtex/newsletter/subscribe.ts",
);
export type StringNewsletter = {
  Title: string;
  desc?: string;
  successText: string;
  errorText: string;
};

function ValidateEmail(mail: string) {
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail));
}

function Newsletter({ Title, desc, successText, errorText }: StringNewsletter) {
  const loading = useSignal(false);
  const sent = useSignal(false);
  const invalid = useSignal(false);
  const handleSubmit: JSX.GenericEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      loading.value = true;
      const email =
        (e.currentTarget.elements.namedItem("email") as RadioNodeList)?.value;
      if (!ValidateEmail(email)) {
        invalid.value = true;
        loading.value = false;
        return;
      }
      invalid.value = false;
      await subscribe({ email });
    } finally {
      loading.value = false;
      sent.value = true;
    }
  };

  return (
    <div class="flex flex-col bg-[#f4f4f4] gap-4  items-center px-[30px] py-[30px] lg:p-10 justify-center lg:max-h-[250px]  lg:max-w-[450px] lg:ml-[auto] lg:mt-[auto]">
      <div class="flex flex-col gap-3">
        <span class="font-bold text-[18px]">
          {Title}
        </span>
        <span class="text-[16px] text-black lg:max-w-[325px]">
          {desc}
        </span>
      </div>
      <form
        class="font-body text-body w-full rounded-none  lg:w-[325px] form-control "
        onSubmit={handleSubmit}
      >
        <div class=" bg-white rounded-none w-full border-b  border-black">
          <input
            name="email"
            class="flex-grow input w-[85%] input-primary h-[40px] focus:outline-none border-none"
            placeholder="e-mail"
            aria-label={"e-mail"}
          />
          <button
            class="bg-transparent  border-none w-[15%]  text-center px-5 pt-4 "
            disabled={loading.value}
            name="envie seu e-mail"
            aria-label={"envie seu e-mail"}
          >
            <Icon
              class="text-black"
              width={20}
              height={20}
              id=">"
              strokeWidth={1}
            />
          </button>
        </div>
        <div class="mt-2 h-4">
          {loading.value
            ? "Carregando..."
            : invalid.value
            ? errorText
            : sent.value
            ? successText
            : null}
        </div>
      </form>
    </div>
  );
}

export default Newsletter;
