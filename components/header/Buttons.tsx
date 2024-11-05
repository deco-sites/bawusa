import Icon from "$store/components/ui/Icon.tsx";
import Button from "$store/components/ui/Button.tsx";
import { sendEvent } from "$store/sdk/analytics.tsx";
import { useUI } from "$store/sdk/useUI.ts";
import { useCart } from "deco-sites/std/packs/vtex/hooks/useCart.ts";
import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";

function SearchButton() {
  const { displaySearchbar } = useUI();

  return (
    <Button
      class="bg-transparent hover:bg-transparent  border-none p-0 m-0 w-[30px]"
      aria-label="search icon button"
      onClick={() => {
        displaySearchbar.value = !displaySearchbar.peek();
      }}
    >
      <Icon id="MagnifyingGlass" width={20} height={20} strokeWidth={0.1} />
    </Button>
  );
}

function MenuButton() {
  const { displayMenu } = useUI();

  return (
    <Button
      class="bg-transparent hover:bg-transparent  border-none p-0 m-0 w-[30px] text-black"
      aria-label="open menu"
      onClick={() => {
        displayMenu.value = true;
      }}
    >
      <Icon id="Bars3" width={20} height={20} strokeWidth={1} />
    </Button>
  );
}

function CartButton() {
  const { displayCart } = useUI();
  const { loading, cart } = useCart();
  const totalItems = cart.value?.items.length || null;

  const onClick = () => {
    displayCart.value = true;
  };

  return (
    <Button
      class="bg-transparent hover:bg-transparent  transform transition   duration-100 hover:scale-110 border-none p-0 m-0 w-[30px]"
      aria-label="open cart"
      data-deco={displayCart.value && "open-cart"}
      loading={loading.value}
      onClick={onClick}
    >
      <div class="indicator  ">
        {totalItems && (
          <span class="w-[10px] mr-1  indicator-item bg-black badge badge-secondary badge-sm">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        )}
        <Icon id="BawCart" width={24} height={24} strokeWidth={1} />
      </div>
    </Button>
  );
}

export interface Props {
  variant: "cart" | "search" | "menu";
}

function Buttons({ variant }: Props) {
  if (variant === "cart") {
    return <CartButton />;
  }

  if (variant === "search") {
    return <SearchButton />;
  }

  if (variant === "menu") {
    return <MenuButton />;
  }

  return null;
}

export default Buttons;
