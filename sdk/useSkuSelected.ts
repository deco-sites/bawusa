import { signal } from "@preact/signals";
import { Sku } from "$store/sdk/useVariantPossiblitiesClientSide.ts";

const skuSelected = signal(<Sku | null> null);

const state = {
  skuSelected,
};

export const useSkuSelected = () => state;
