import type { LoaderReturnType } from "$live/types.ts";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
import Metatags from "./MetatagsBaw.tsx";

export interface Props {
  page: LoaderReturnType<ProductListingPage | null>;
  /**
   * @title Title template
   * @description add a %s whenever you want it to be replaced with the product name
   * @default %s | Baw Clothing
   */
  titleTemplate?: string;
  /** @title Page Title override */
  title?: string;
  /** @title Metatag description override */
  description?: string;
  /** @description Recommended: 16 x 16 px */
  favicon?: LiveImage;
  /** @title Image */
  image?: LiveImage;
  /** @title Canonical */
  canonical?: string;
}

const SeoPLPBaw = (props: Props) => (
  <Metatags
    {...props}
    context={props.page}
  />
);

export default SeoPLPBaw;
