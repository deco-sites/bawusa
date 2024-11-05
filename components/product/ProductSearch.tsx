import Image from "apps/website/components/Image.tsx";
import Avatar from "$store/components/ui/Avatar.tsx";
import WishlistIcon from "$store/islands/WishlistButton.tsx";
import { useOffer } from "$store/sdk/useOffer.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { sendEventOnClick } from "$store/sdk/analytics.tsx";
import type { Product } from "apps/commerce/types.ts";
import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";
import { mapUserToShopperAnalytics } from "$store/sdk/userToShopperAnalytics.ts";

interface Props {
  product: Product;
  /** Preload card image */
  preload?: boolean;

  /** @description used for analytics event */
  itemListName?: string;
  colorRed?: boolean;
}

export interface Layout {
  basics?: {
    contentAlignment?: "Left" | "Center";
    oldPriceSize?: "Small" | "Normal";
    ctaText?: string;
  };
  elementsPositions?: {
    skuSelector?: "Top" | "Bottom";
    favoriteIcon?: "Top right" | "Top left";
  };
  hide?: {
    productName?: boolean;
    productDescription?: boolean;
    allPrices?: boolean;
    installments?: boolean;
    skuSelector?: boolean;
    cta?: boolean;
  };
  onMouseOver?: {
    image?: "Change image" | "Zoom image";
    card?: "None" | "Move up";
    showFavoriteIcon?: boolean;
    showSkuSelector?: boolean;
    showCardShadow?: boolean;
    showCta?: boolean;
  };
}
const relative = (url: string) => {
  const link = new URL(url);
  return `${link.pathname}${link.search}`;
};

const WIDTH = 280;
const HEIGHT = 420;

function ProductCard(
  { product, preload, itemListName, colorRed = false }: Props,
) {
  const {
    url,
    productID,
    name,
    image: images,
    offers,
    isVariantOf,
  } = product;
  const { user } = useUser();
  const shopper = user.value?.email
    ? mapUserToShopperAnalytics(user.value)
    : undefined;
  const productGroupID = isVariantOf?.productGroupID;
  const [front, back] = images ?? [];
  const { listPrice, price, installments, availability, seller } = useOffer(
    offers,
  );
  const installmentText = installments?.replace(" sem juros", "").replace(
    ".",
    ",",
  ).replace(" de", "");
  const hasVariant = isVariantOf?.hasVariant ?? [];
  const possibilities = useVariantPossibilities(hasVariant);
  const sizeObject = possibilities["Tamanho"] || {};

  const variants = Object.keys(sizeObject).map((name) => {
    return {
      name,
      availability: sizeObject[name]?.availability,
      url: sizeObject[name]?.url,
      productID: sizeObject[name]?.productID,
    };
  });

  const sizes = ["4P", "3P", "PP", "P", "M", "G", "GG", "GGG", "3G", "4G", "U"];
  const orderedVariants = sizes.map((size) =>
    variants.find((sku) => sku.name === size)
  ).filter((item) => item !== undefined);
  const newVariants = orderedVariants.length > 0 ? orderedVariants : variants;
  const clickEvent = {
    name: "select_item" as const,
    params: {
      item_list_name: itemListName,
      shopper,
      items: [
        mapProductToAnalyticsItem({
          product,
          price,
          listPrice,
        }),
      ],
    },
  };

  return (
    <div
      class="card card-compact card-bordered rounded-none border-transparent group w-full "
      data-deco="view-product"
      id={`product-card-${productID}`}
      {...sendEventOnClick(clickEvent)}
    >
      <figure class="relative " style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}>
        {/* Wishlist button */}
        <div class="absolute top-0 right-0 z-10">
          <WishlistIcon
            price={price}
            productGroupID={productGroupID}
            productID={productID}
          />
        </div>

        {/* Product Images */}
        <a
          href={url && relative(url)}
          aria-label="view product"
          class="contents"
        >
          <Image
            src={front.url!}
            alt={front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            class="absolute transition-opacity w-full opacity-100 group-hover:opacity-0"
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
          <Image
            src={back?.url ?? front.url!}
            alt={back?.alternateName ?? front.alternateName}
            width={WIDTH}
            height={HEIGHT}
            class="absolute transition-opacity w-full opacity-0 group-hover:opacity-100"
            sizes="(max-width: 640px) 50vw, 20vw"
            preload={preload}
            loading={preload ? "eager" : "lazy"}
            decoding="async"
          />
        </a>
        <div class="group/edit">
          <figcaption class=" card-body card-actions absolute bottom-0 left-0 w-full  transition-opacity opacity-0 group-hover:opacity-100 bg-green-600">
            {/* COMPRA */}
            <ul class="flex justify-center items-center  w-full">
              <a class="uppercase w-full text-white text-center font-bold sm:text-xl text-sm">
                Compra
              </a>
            </ul>
          </figcaption>
          <figcaption class="card-body card-actions m-0 absolute bottom-1 left-0 w-full  transition-opacity opacity-0 group-hover/edit:opacity-100 bg-white ">
            <ul class="flex flex-row flex-wrap justify-center items-center gap-2 w-full">
              {newVariants.map((item) => (
                <a href={item?.url}>
                  <Avatar
                    variant={item?.productID === productID
                      ? "active"
                      : (item?.availability !== "https://schema.org/OutOfStock"
                        ? "default"
                        : "disabled")}
                    content={item?.name!}
                    textSize="lg"
                  />
                </a>
              ))}
            </ul>
          </figcaption>
        </div>
      </figure>
      {/* Prices & Name */}
      <div class=" gap-0 p-0">
        <h2 class="card-title m-0  text-black text-[14px] font-normal uppercase">
          {isVariantOf!.name}
        </h2>
        <div class="flex flex-col  sm:flew-row items-start sm:items-end gap-1">
          <div class="hidden w-full flew-row flex-grow flex-wrap  items-start  sm:flex">
            <span class="text-xs 2xl:text-sm font-bold sm:flex hidden">
              {installmentText
                ? (installmentText?.length === 8
                  ? (installmentText + ",00" + " /")
                  : (installmentText + " /"))
                : ("")}
            </span>

            <span class="line-through text-xs 2xl:text-sm   text-[#2f2f2f] pl-1 sm:flex hidden">
              {listPrice !== price
                ? (`${formatPrice(listPrice, offers!.priceCurrency!)} `)
                : ("")}
            </span>
            <span class="text-xs 2xl:text-sm  font-bold text-black sm:flex hidden px-1">
              {listPrice !== price ? (` /`) : ("")}
            </span>
            <span
              class={`${
                colorRed ? "text-red-700 " : ""
              }text-xs 2xl:text-sm font-bold`}
            >
              {price
                ? (formatPrice(price, offers!.priceCurrency!))
                : ("Produto esgotado")}
            </span>
          </div>
          <div class="flex flew-row  items-start sm:items-end gap-1 sm:hidden">
            <span class="line-through text-xs 2xl:text-sm   text-[#2f2f2f] ">
              {listPrice !== price
                ? (`${formatPrice(listPrice, offers!.priceCurrency!)}`)
                : ("")}
            </span>

            <span class="text-xs 2xl:text-sm  font-bold">
              {listPrice !== price ? (`/`) : ("")}
            </span>
            <span
              class={`${
                colorRed ? "text-red-700 " : ""
              }text-xs 2xl:text-sm font-bold`}
            >
              {price
                ? (formatPrice(price, offers!.priceCurrency!))
                : ("Produto esgotado")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
