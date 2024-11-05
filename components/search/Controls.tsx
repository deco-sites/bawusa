import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import BawFilters from "$store/components/search/BawFilters.tsx";
import Sort from "$store/components/search/Sort.tsx";
import Modal from "$store/components/ui/Modal.tsx";
import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import { useSignal } from "@preact/signals";
import type { ProductListingPage } from "apps/commerce/types.ts";
import GridListToggle from "./GridListToggle.tsx";

type Props =
  & Pick<ProductListingPage, "filters" | "breadcrumb" | "sortOptions">
  & {
    displayFilter?: boolean;
  };

function SearchControls(
  { filters, displayFilter, sortOptions }: Props,
) {
  const open = useSignal(false);

  return (
    <div class="flex flex-col justify-between mb-4 p-4 sm:mb-0 sm:p-0 sm:gap-4 sm:flex-row sm:h-[53px] ">
      <GridListToggle />

      <div class="flex flex-row items-center justify-between border-b border-base-200 sm:gap-4 sm:border-none">
        {sortOptions.length > 0 && <Sort sortOptions={sortOptions} />}
        <Button
          class={displayFilter ? "btn-ghost" : "btn-ghost sm:hidden"}
          onClick={() => {
            open.value = true;
          }}
          aria-label={"filtrar"}
        >
          Filtrar
        </Button>
      </div>

      <Modal
        loading="lazy"
        class="left-auto md:left-0 absolute top-[50px] p-0 rounded-none"
        open={open.value}
        onClose={() => {
          open.value = false;
        }}
      >
        <BawFilters filters={filters} />
      </Modal>
    </div>
  );
}

export default SearchControls;
