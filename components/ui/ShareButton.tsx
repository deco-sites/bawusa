import { useComputed, useSignal } from "@preact/signals";
import Icon from "$store/components/ui/Icon.tsx";
import Button from "$store/components/ui/Button.tsx";
import { useWishlist } from "deco-sites/std/packs/vtex/hooks/useWishlist.ts";
import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";
import { useUI } from "../../sdk/useUI.ts";

export interface Props {
  productID: string;
  productGroupID?: string;
  variant?: "icon" | "full";
  url: string;
}

function ShareButton({
  variant = "icon",
  productGroupID,
  productID,
  url,
}: Props) {
  const { user } = useUser();
  const item = { sku: productID, productId: productGroupID };
  const { loading, addItem, removeItem, getItem } = useWishlist();
  const { buttonShare } = useUI();

  return (
    <>
      <Button
        class={variant === "icon"
          ? "btn-circle btn-ghost gap-2"
          : "btn-outline gap-2"}
        loading={false}
        aria-label="Share Button"
        onClick={(e) => {
          buttonShare.value = !buttonShare.value;
        }}
      >
        <Icon
          id="share"
          width={20}
          height={22}
          strokeWidth={1}
        />
      </Button>
      {buttonShare.value === true
        ? (
          <div
            class={`flex flex-col bg-white justify-center items-center p-5 z-1 top-0 right-0 rounded-lg font-bold `}
          >
            <span class="uppercase text-base mb-2">Compartilhar</span>
            <div class="flex flex-row gap-5 justify-center items-center">
              <a
                href={"https://wa.me/?text=" + url}
                target="_blank"
              >
                <Icon
                  class="text-green-500"
                  id="WhatsApp"
                  size={20}
                  strokeWidth={1}
                />
              </a>

              <a
                href={"https://www.facebook.com/sharer/sharer.php?u=" + url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  class="text-blue-800"
                  id="Facebook"
                  size={20}
                  strokeWidth={2}
                />
              </a>
              <a
                href={"https://br.pinterest.com/pin/create/button/?media=" +
                  url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  class="text-red-700"
                  id="pinterest"
                  size={20}
                  strokeWidth={1}
                />
              </a>
              <a
                href={"https://twitter.com/intent/tweet?url=" + url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon
                  class="text-blue-500"
                  id="TwitterLogo"
                  size={20}
                  strokeWidth={1}
                />
              </a>
            </div>
          </div>
        )
        : ("")}
    </>
  );
}

export default ShareButton;
