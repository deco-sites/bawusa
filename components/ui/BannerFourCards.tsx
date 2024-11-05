import { useId } from "preact/hooks";
import Image from "apps/website/components/Image.tsx";
import { Picture, Source } from "deco-sites/std/components/Picture.tsx";
import type { LoaderReturnType } from "$live/types.ts";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
import type { Video as LiveVideo } from "deco-sites/std/components/types.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import WishlistIcon from "$store/islands/WishlistButton.tsx";
import AddToCartAvatar from "$store/islands/AddToCartAvatar.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { sendEventOnClick } from "$store/sdk/analytics.tsx";
import { formatDiscount } from "$store/sdk/format.ts";
import type { Product } from "apps/commerce/types.ts";
import ProductSelector from "../product/ProductVariantSelectorPLP.tsx";
import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";
import { mapUserToShopperAnalytics } from "$store/sdk/userToShopperAnalytics.ts";

export type BorderRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export interface BannerItem {
  /** @default movie */
  type: "movie" | "image";

  srcMobile: LiveVideo | LiveImage;
  srcDesktop: LiveVideo | LiveImage;
  /** */
  alt?: string;
  /** */
  href?: string;
  /** @default "Left"  */
}

export interface Props {
  ordem: "Banner/Cards" | "Cards/Banner";
  borderRadius: {
    mobile?: BorderRadius;
    desktop?: BorderRadius;
  };

  productCard?: LoaderReturnType<ProductListingPage | null>;

  bannerFirst: BannerItem;
  itemListName?: string;
  preload?: boolean;
  colorRed?: boolean;
}

const RADIUS_MOBILE = {
  "none": "rounded-none",
  "sm": "rounded-sm",
  "md": "rounded-md",
  "lg": "rounded-lg",
  "xl": "rounded-xl",
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
  "full": "rounded-full",
};

const RADIUS_DESKTOP = {
  "none": "sm:rounded-none",
  "sm": "sm:rounded-sm",
  "md": "sm:rounded-md",
  "lg": "sm:rounded-lg",
  "xl": "sm:rounded-xl",
  "2xl": "sm:rounded-2xl",
  "3xl": "sm:rounded-3xl",
  "full": "sm:rounded-full",
};

function CardMovie(
  { banner, borderRadius }: {
    banner: BannerItem;
    borderRadius: {
      mobile?: BorderRadius;
      desktop?: BorderRadius;
    };
  },
) {
  return (
    <>
      {banner?.type === "movie"
        ? (
          <section class="w-full px-auto  xl:m-0 xl:overflow-hidden pr-[40px] ">
            <div>
              <a
                href={banner?.href}
                class={`overflow-hidden ${
                  RADIUS_MOBILE[borderRadius.mobile ?? "none"]
                } ${RADIUS_DESKTOP[borderRadius.desktop ?? "none"]} `}
              >
                <div class="w-full  m-0 p-o b">
                  <video
                    src={banner?.srcDesktop}
                    alt={banner?.alt}
                    autoPlay
                    muted
                    loop
                    preload="auto"
                    webkit-playsinline
                    x5-playsinline
                    playsInline
                    class="hidden w-full xl:inline-block"
                  >
                    Video não suportado!
                  </video>
                  <video
                    src={banner?.srcMobile}
                    alt={banner?.alt}
                    autoPlay
                    muted
                    loop
                    preload="auto"
                    webkit-playsinline
                    x5-playsinline
                    playsInline
                    class="xl:hidden w-full inline-block"
                  >
                    Video não suportado!
                  </video>
                </div>
              </a>
            </div>
          </section>
        )
        : (
          <div class="grid grid-cols-1 grid-rows-1 ">
            <Picture
              preload
              class="col-start-1 col-span-1 row-start-1 row-span-1"
            >
              {banner?.srcMobile
                ? (
                  <Source
                    src={banner?.srcMobile}
                    class="w-full  "
                    width={335}
                    height={500}
                    media="(max-width: 767px)"
                  />
                )
                : ("")}
              {banner?.srcDesktop
                ? (
                  <Source
                    src={banner.srcDesktop}
                    class="w-full  "
                    width={960}
                    height={1440}
                    media="(min-width: 767px)"
                  />
                )
                : ("")}

              {banner?.srcDesktop
                ? (
                  <Image
                    class="w-full object-cover 2xl:h-[1300px]  "
                    src={banner.srcDesktop}
                    alt={banner.alt}
                    width={960}
                    height={1440}
                    preload={true}
                    loading={"eager"}
                  />
                )
                : ("")}
            </Picture>
          </div>
        )}
    </>
  );
}
function CardItem(
  { product, itemListName, lcp = false, colorRed }: {
    product: Product;
    lcp?: boolean;
    itemListName?: string;
    preload?: boolean;
    colorRed?: boolean;
  },
) {
  const {
    url,
    productID,
    name,
    image: images,
    offers,
    isVariantOf,
  } = product;
  const fImages = images?.filter((img) =>
    img.alternateName !== "color-thumbnail"
  );
  const productGroupID = isVariantOf?.productGroupID;
  const [front, back] = fImages ?? [];
  const { listPrice, price, installments, availability, seller } = useOffer(
    offers,
  );
  const installmentText = installments?.replace(" sem juros", "").replace(
    ".",
    ",",
  ).replace(" de", "");
  const { user } = useUser();
  const shopper = user.value?.email
    ? mapUserToShopperAnalytics(user.value)
    : undefined;
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
  const outOfStock =
    variants.filter((item) =>
      item.availability === "https://schema.org/InStock"
    ).length === 0;

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

  const relative = (url: string) => {
    const link = new URL(url);
    return `${link.pathname}`;
  };

  const WIDTH = 300;
  const HEIGHT = 540;

  return (
    <div
      class="card card-compact card-bordered rounded-none border-transparent group  w-[150px] lg:w-[200px]    2xl:w-[300px]  "
      data-deco="view-product"
      id={`product-card-${productID}`}
      {...sendEventOnClick(clickEvent)}
    >
      <div
        class={`relative  w-[150px] lg:w-[200px]    2xl:w-[300px] `}
      >
        <figure
          class="relative "
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        >
          {/* Wishlist button */}
          <div class="absolute top-0 right-0 z-10">
            <WishlistIcon
              price={price}
              productGroupID={productGroupID}
              productID={productID}
            />
          </div>
          {price && listPrice && listPrice !== price
            ? (
              <div class="absolute flex justify-center top-0 left-0 z-10 mt-3 ml-2">
                <span class="rounded-[100px] font-bold bg-black text-white p-1 px-2  text-xs">
                  {formatDiscount(price, listPrice)}% OFF
                </span>
              </div>
            )
            : ("")}

          {/* Product Images */}
          <a
            href={url && relative(url)}
            aria-label="view product"
            class="contents flex"
          >
            <Image
              src={front.url!}
              alt={front.alternateName}
              width={300}
              height={500}
              class="absolute top-0 left-0  transition-opacity w-full  object-cover opacity-100 group-hover:opacity-0 "
              loading={lcp ? "eager" : "lazy"}
              sizes="(max-width: 640px) "
              decoding="async"
            />
            <Image
              src={back?.url ?? front.url!}
              alt={back?.alternateName ?? front.alternateName}
              width={300}
              height={500}
              class="absolute top-0 left-0  transition-opacity  w-full object-cover opacity-0 group-hover:opacity-100"
              loading={lcp ? "eager" : "lazy"}
              sizes="(max-width: 640px) "
              decoding="async"
            />
          </a>

          <div class="group/edit">
            <figcaption class=" card-body card-actions absolute bottom-0 left-0 w-full  transition-opacity opacity-0 group-hover:opacity-100 bg-green-600">
              {/* COMPRA */}
              <ul class="flex justify-center items-center  w-full">
                <a class="uppercase w-full text-white text-center font-bold text-xl">
                  Compra
                </a>
              </ul>
            </figcaption>
            {/* SKU Selector */}

            <figcaption class="card-body card-actions m-0 p-[10px] absolute bottom-1 left-0 w-full  transition-opacity opacity-0 group-hover/edit:opacity-100 bg-white ">
              <ProductSelector product={product} />
            </figcaption>
          </div>
        </figure>
        {/* Prices & Name */}
        <div class=" flex flex-col p-0 m-0 h-[90px] max-h-[90px] justify-start items-start">
          <h2 class="card-title w-full    text-[#2f2f2f] text-sm 2xl:text-base  font-normal uppercase">
            {isVariantOf!.name}
          </h2>
          <div class="flex flex-col  xl:flew-row items-start ">
            <div class="hidden flew-row  items-start xl:flex flex-wrap">
              <span class="text-xs 2xl:text-base font-bold xl:flex hidden  ">
                {installmentText
                  ? (installmentText?.length === 8
                    ? (installmentText + ",00" + " / ")
                    : (installmentText?.length === 10
                      ? (installmentText + "0" + " / ")
                      : (installmentText + " / ")))
                  : ("")}
              </span>

              <span class="line-through px-1  text-xs 2xl:text-base  text-[#2f2f2f] xl:flex hidden">
                {listPrice !== price
                  ? (`${formatPrice(listPrice, offers!.priceCurrency!)} `)
                  : ("")}
              </span>
              <span class="text-xs 2xl:text-base  pr-1  font-bold text-black xl:flex hidden">
                {listPrice !== price ? (` /`) : ("")}
              </span>
              <span
                class={`${
                  colorRed ? "text-red-700 " : ""
                }text-xs 2xl:text-base font-bold`}
              >
                {price && !outOfStock
                  ? (formatPrice(price, offers!.priceCurrency!))
                  : ("Produto esgotado")}
              </span>
            </div>

            <div class="flex flew-row  items-start xl:hidden flex-wrap">
              <span class="line-through text-xs 2xl:text-base   text-[#2f2f2f] px-1 ">
                {listPrice !== price
                  ? (formatPrice(listPrice, offers!.priceCurrency!))
                  : (" ")}
              </span>

              <span class="text-xs 2xl:text-base  font-bold ">
                {listPrice !== price ? ("/ ") : (" ")}
              </span>
              <span
                class={`${
                  colorRed ? "text-red-700 " : ""
                }text-xs 2xl:text-base font-bold pl-1`}
              >
                {price && !outOfStock
                  ? (formatPrice(price, offers!.priceCurrency!))
                  : (" Produto esgotado")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardsCamps(
  {
    ordem,

    borderRadius,
    colorRed,
    itemListName,
    preload,
    productCard,
    bannerFirst,
  }: Omit<Props, "productCard"> & { productCard: ProductListingPage },
) {
  const id = useId();
  return (
    <>
      {ordem === "Banner/Cards"
        ? (
          <div class="w-full lg:container lg:max-w-[90vw] flex flex-col lg:flex-row gap-5 lg:gap-10 px-[15px] pt-[10px] justify-center my-2">
            <div
              class={`w-full justify-end  flex `}
            >
              <CardMovie banner={bannerFirst} borderRadius={borderRadius} />
            </div>

            <div
              id={id}
              class="flex flex-row flex-wrap gap-2  justify-center  lg:justify-start"
            >
              {productCard !== undefined
                ? (productCard!.products?.map((product, index) => (
                  <CardItem
                    product={product}
                    colorRed={colorRed}
                    itemListName={itemListName}
                    preload={preload}
                  />
                )))
                : ("")}
            </div>
          </div>
        )
        : (
          <div class="w-full lg:container lg:max-w-[90vw] flex flex-col lg:flex-row gap-5 lg:gap-10 px-[15px] pt-[10px] justify-center my-2">
            <div
              id={id}
              class="flex flex-row flex-wrap gap-2  justify-center  lg:justify-end"
            >
              {productCard !== undefined
                ? (productCard!.products?.map((product, index) => (
                  <CardItem
                    product={product}
                    colorRed={colorRed}
                    itemListName={itemListName}
                    preload={preload}
                  />
                )))
                : ("")}
            </div>

            <div
              class={`w-full justify-start  flex `}
            >
              <CardMovie banner={bannerFirst} borderRadius={borderRadius} />
            </div>
          </div>
        )}
    </>
  );
}
function BannerFourCards(
  { productCard, ...props }: Props,
) {
  return <CardsCamps {...props} productCard={productCard!} />;
}

export default BannerFourCards;
