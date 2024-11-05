import Breadcrumb from "$store/components/ui/Breadcrumb.tsx";
import { useSignal } from "@preact/signals";
import type { ProductListingPage } from "apps/commerce/types.ts";
import type { LoaderReturnType } from "$live/types.ts";

export interface Props {
  page?: LoaderReturnType<ProductListingPage | null>;
  /**
   * @description Use drawer for mobile like behavior on desktop. Aside for rendering the filters alongside the products
   */
}

function BreadcrumbControls({
  page,
}: Omit<Props, "page"> & { page: ProductListingPage }) {
  const { breadcrumb } = page!;

  return (
    <div class="w-full p-5 flex flex-row items-center sm:p-5 mb-2">
      <Breadcrumb itemListElement={breadcrumb?.itemListElement} />
    </div>
  );
}

export default BreadcrumbControls;
