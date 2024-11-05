/**
 * This file takes care of global app side effects,
 * like clicking on add to cart and the cart modal being displayed
 */

import { signal } from "@preact/signals";
import { Sku } from "$store/sdk/useVariantPossiblitiesClientSide.ts";
const displayCart = signal(false);
const displayMenu = signal(false);
const displaySearchbar = signal(false);
const listingType = signal("4");
const buttonShare = signal(false);
const skuSelected = signal(<Sku | null> null);

const state = {
  displayCart,
  displayMenu,
  displaySearchbar,
  listingType,
  buttonShare,
  skuSelected,
};

export const useUI = () => state;
