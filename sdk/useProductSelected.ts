import { signal } from "@preact/signals";
import { Product } from "apps/commerce/types.ts";

const productSelected = signal(<Product | null> null);

const state = {
  productSelected,
};

export const useProductSelected = () => state;
