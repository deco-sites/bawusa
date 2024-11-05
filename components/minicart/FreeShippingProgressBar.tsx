import Icon from "$store/components/ui/Icon.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import Button from "$store/components/ui/Button.tsx";
import { useUI } from "$store/sdk/useUI.ts";

interface Props {
  total: number;
  target: number;
  locale: string;
  currency: string;
}

function FreeShippingProgressBar({ target, total, currency, locale }: Props) {
  const remaining = target - total;
  const percent = Math.floor((total / target) * 100);
  const { displayCart } = useUI();
  return (
    <div class="flex flex-col w-full">
      <div class="flex justify-start items-center gap-2 text-white w-full">
        <Button
          class="btn btn-ghost"
          aria-label={"xMark"}
          onClick={() => displayCart.value = !displayCart.value}
        >
          <Icon id="XMark" width={20} height={20} strokeWidth={2} />
        </Button>{" "}
        {remaining > 0
          ? (
            <span class="font-semibold">
              Faltam {formatPrice(remaining, currency, locale)}{" "}
              para ganhar frete grátis!
            </span>
          )
          : (
            <span class="w-[200px] text-center ">
              Você ganhou frete grátis!
            </span>
          )}
      </div>
      <div class="flex flex-row w-full items-center px-4">
        <span class="w-[100px] text-xs">
          {total &&
            (formatPrice(total, currency!, locale))}
        </span>
        <progress
          class="progress progress-accent w-full mr-1"
          value={percent}
          max={100}
        />
        <span class="w-[100px] text-xs">
          R$ 299, 90
        </span>
      </div>
    </div>
  );
}

export default FreeShippingProgressBar;
