import Modal from "$store/components/ui/Modal.tsx";
import ModalMenu from "$store/components/ui/ModalMenu.tsx";

import { lazy, Suspense } from "preact/compat";
import { useUI } from "$store/sdk/useUI.ts";

import type { Props as MenuProps } from "$store/components/header/Menu.tsx";
import type { Props as SearchbarProps } from "$store/components/search/Searchbar.tsx";
import Loading from "$store/components/ui/Loading.tsx";

const Menu = lazy(() => import("$store/components/header/Menu.tsx"));
const Cart = lazy(() => import("$store/components/minicart/Cart.tsx"));
const Searchbar = lazy(() => import("$store/components/search/Searchbar.tsx"));

interface Props {
  menu: MenuProps;
  searchbar?: SearchbarProps;
}

function Modals({ menu, searchbar }: Props) {
  const { displayCart, displayMenu, displaySearchbar } = useUI();

  return (
    <>
      {displayMenu.value && (
        <ModalMenu
          loading="lazy"
          class="left-auto md:left-0 absolute top-2 p-0 rounded-none "
          open={displayMenu.value}
          onClose={() => {
            displayMenu.value = false;
          }}
        >
          <Suspense fallback={<Loading />}>
            <Menu {...menu} />
          </Suspense>
        </ModalMenu>
      )}

      <Modal
        loading="lazy"
        open={displaySearchbar.value &&
          window?.matchMedia("(max-width: 767px)")?.matches}
        onClose={() => {
          displaySearchbar.value = false;
        }}
      >
        <Suspense fallback={<Loading />}>
          <Searchbar {...searchbar} />
        </Suspense>
      </Modal>

      <Modal
        loading="lazy"
        class="right-auto md:right-[40px] md:w-[400px] absolute top-2 md:h-auto h-[87vh] w-[95vw] max-h-[90vh] p-0 rounded-none flex"
        open={displayCart.value}
        onClose={() => {
          displayCart.value = false;
        }}
      >
        <Suspense fallback={<Loading />}>
          {displayCart.value && <Cart />}
        </Suspense>
      </Modal>
    </>
  );
}

export default Modals;
