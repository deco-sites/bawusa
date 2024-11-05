import { useId } from "preact/hooks";
import { Picture, Source } from "deco-sites/std/components/Picture.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import type { Video as LiveViedo } from "deco-sites/std/components/types.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import WishlistIcon from "$store/islands/WishlistButton.tsx";
import Image from "apps/website/components/Image.tsx";
import AddToCartAvatar from "$store/islands/AddToCartAvatar.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useVariantPossibilities } from "$store/sdk/useVariantPossiblities.ts";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import { sendEventOnClick } from "$store/sdk/analytics.tsx";
import { formatDiscount } from "$store/sdk/format.ts";
import type { Product } from "apps/commerce/types.ts";
import type { LoaderReturnType } from "$live/types.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
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

export type MD =
  | "sim"
  | "nao";

export interface Text {
  mobile: MD;
  desktop: MD;
  text?: string;
  size: 1 | 2 | 3;
}

export interface BannerMovieIMG {
  mobile: MD;
  desktop: MD;
  type: "movie" | "image";
  srcDesktop?: LiveViedo | LiveImage;
  srcMobile?: LiveViedo | LiveImage;
  alt?: string;
  href?: string;
  size: 1 | 2 | 3;
  sizeMobile: 1 | 2;
  vertical?: "start" | "center" | "end";
  desalinhamento?: boolean;
  desalinhamentoAltura?:
    | "margin-top--100px"
    | "margin-top--200px"
    | "margin-top--300px"
    | "margin-top--80px"
    | "align";
}

export interface Props {
  ordem: "Card/Movie/Text" | "Text/Movie/card";

  productCard?: LoaderReturnType<ProductListingPage | null>;
  horizontal: "start" | "center" | "end" | "between" | "around" | "evenly";

  /** @default 2 */
  size: 1 | 2 | 3;
  sizeMobile: 1 | 2;
  desalinhamento?:
    | "margin-top-100px"
    | "margin-top-200px"
    | "margin-top-300px"
    | "margin-top--80px"
    | "align";
  productCardMobileColum?: boolean;
  itemListName?: string;
  preload?: boolean;
  colorRed?: boolean;
  borderRadius: {
    mobile?: BorderRadius;
    desktop?: BorderRadius;
  };

  cards?: {
    banner?: BannerMovieIMG;
    text?: Text;
  };
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

const SIZE_IMG = {
  1: " lg:w-[620px]",
  2: " lg:w-[510px]",
  3: " lg:w-[400px]",
};
const SIZE_BANNER = {
  1: " md:w-[820px]",
  2: " md:w-[625px]",
  3: " md:w-[400px]",
};
const SIZE_BANNER_MOBILE = {
  1: " w-[335px] ",
  2: " w-[150px] ",
};
const SIZE_CARD_MOBILE = {
  1: " w-[335px] ",
  2: " w-[150px] ",
};

const HORIZONTAL = {
  start: "lg:justify-start",
  center: "lg:justify-center",
  end: "lg:justify-end",
  between: "lg:justify-between",
  around: "lg:justify-around",
  evenly: "lg:justify-evenly",
};

const SIZE_IMG_H = {
  1: 1100,
  2: 760,
  3: 600,
};
const DESALINHAMENTO = {
  "margin-top-100px": "lg:mt-[100px]",
  "margin-top-200px": "lg:mt-[200px]",
  "margin-top-300px": "lg:mt-[300px]",
  "margin-top--80px": "lg:mt-[-80px]",
  "align": "lg:mt-[0px]",
};
const DESALINHAMENTOBANNER = {
  "margin-top--100px": "lg:mt-[-100px]",
  "margin-top--200px": "lg:mt-[-200px]",
  "margin-top--300px": "lg:mt-[-300px]",
  "margin-top--80px": "lg:mt-[80px]",
  "align": "lg:mt-[0px]",
};
const SIZE_IMG_W = {
  1: 620,
  2: 510,
  3: 400,
};
const DESKTOP = {
  sim: "sm:flex",
  nao: "sm:hidden",
};
const MOBILE = {
  sim: "flex",
  nao: "hidden",
};

const SIZE_FONT = {
  1: "text-[40px] sm:text-[110px]",
  2: "text-[30px] sm:text-[80px]",
  3: "text-[20px] sm:text-[50px]",
};

function CardMovie(
  { banner, borderRadius }: {
    banner: BannerMovieIMG;
    borderRadius: {
      mobile?: BorderRadius;
      desktop?: BorderRadius;
    };
  },
) {
  const id = useId();

  return (
    <>
      {banner.type === "movie"
        ? (
          <section
            id={id}
            class={`  sm:max-w-none sm:m-0 sm:overflow-hidden  ${
              DESKTOP[banner!.desktop!]
            }  ${MOBILE[banner!.mobile!]}`}
          >
            <a
              href={banner?.href}
              class={`overflow-hidden ${
                RADIUS_MOBILE[borderRadius.mobile ?? "none"]
              } ${RADIUS_DESKTOP[borderRadius.desktop ?? "none"]} `}
            >
              <div
                class={` m-0 p-0  ${SIZE_BANNER[banner!.size!]} ${
                  SIZE_BANNER_MOBILE[banner!.sizeMobile!]
                }`}
              >
                <video
                  src={banner.srcDesktop}
                  alt={banner.alt}
                  autoPlay
                  muted
                  loading="eager"
                  loop
                  preload="auto"
                  webkit-playsinline
                  x5-playsinline
                  playsInline
                  class="hidden w-full h-full sm:inline-block"
                >
                  Video não suportado!
                </video>
                <video
                  src={banner.srcMobile}
                  alt={banner.alt}
                  autoPlay
                  muted
                  loop
                  preload="auto"
                  loading="eager"
                  webkit-playsinline
                  x5-playsinline
                  playsInline
                  class="sm:hidden w-full inline-block"
                >
                  Video não suportado!
                </video>
              </div>
            </a>
          </section>
        )
        : (
          <div
            id={id}
            class={`grid grid-cols-1 grid-rows-1 ${
              DESKTOP[banner!.desktop!]
            }  ${MOBILE[banner!.mobile!]}`}
          >
            <Picture
              preload={true}
              loading="eager"
              class="col-start-1 col-span-1 row-start-1 row-span-1"
            >
              {banner.srcMobile
                ? (
                  <Source
                    src={banner.srcMobile}
                    class={` m-0 p-0   ${
                      SIZE_BANNER_MOBILE[banner!.sizeMobile!]
                    }`}
                    width={335}
                    height={500}
                    media="(max-width: 767px)"
                  />
                )
                : ("")}
              {banner.srcDesktop
                ? (
                  <Source
                    src={banner.srcDesktop}
                    class={` m-0 p-0  ${SIZE_BANNER[banner!.size!]}  `}
                    width={960}
                    height={1440}
                    media="(min-width: 767px)"
                  />
                )
                : ("")}

              {banner.srcDesktop
                ? (
                  <img
                    loading="eager"
                    preload="true"
                    class={` m-0 p-0  ${SIZE_BANNER[banner!.size!]}  ${
                      SIZE_BANNER_MOBILE[banner!.sizeMobile!]
                    }`}
                    src={banner.srcDesktop}
                    alt={banner.alt}
                  />
                )
                : ("")}
            </Picture>
          </div>
        )}
    </>
  );
}
function TextCamp({ text }: { text: Text }) {
  const id = useId();

  return (
    <div
      id={id}
      class={`flex flex-col justify-center w-full font-bold   ${
        DESKTOP[text.desktop!]
      }  ${MOBILE[text.mobile!]} `}
    >
      <h1
        class={`sm:-rotate-90 ${
          SIZE_FONT[text.size!]
        }  text-center uppercase font-extrabold text-gray-700`}
      >
        {text.text !== undefined ? (text.text) : ("")}
      </h1>
    </div>
  );
}
function CardItem(
  {
    product,
    itemListName,
    lcp,
    preload = false,
    colorRed,
    size,
    index,
    desalinhamento,
    sizeMobile,
  }: {
    product: Product;
    lcp?: boolean;
    itemListName?: string;
    preload?: boolean;
    colorRed?: boolean;
    size: 1 | 2 | 3;
    index: number;
    desalinhamento:
      | "margin-top-100px"
      | "margin-top-200px"
      | "margin-top-300px"
      | "margin-top--80px"
      | "align";
    sizeMobile: 1 | 2;
  },
) {
  const id = useId();
  const { user } = useUser();
  const shopper = user.value?.email
    ? mapUserToShopperAnalytics(user.value)
    : undefined;
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
  return (
    <div
      class="card card-compact card-bordered rounded-none border-transparent group "
      data-deco="view-product"
      id={`product-card-${productID}`}
      {...sendEventOnClick(clickEvent)}
    >
      <div
        class={`relative ${SIZE_IMG[size!]} ${SIZE_CARD_MOBILE[sizeMobile!]} ${
          index === 1 ? (DESALINHAMENTO[desalinhamento!]) : ("")
        }`}
      >
        <figure
          class="relative "
          style={{ aspectRatio: `${SIZE_IMG_W[size!]} / ${SIZE_IMG_H[size!]}` }}
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
                <span class="rounded-[100px] font-bold bg-black text-white p-1 px-2 text-xs">
                  {formatDiscount(price, listPrice)}% OFF
                </span>
              </div>
            )
            : ("")}

          {/* Product Images */}
          <a
            href={url && relative(url)}
            aria-label="view product"
            class="contents"
          >
            <Image
              src={front.url!}
              alt={front.alternateName}
              width={510}
              height={760}
              class="absolute top-0 left-0  transition-opacity w-full max-h-[760px]  object-cover opacity-100 group-hover:opacity-0 "
              loading={preload ? "eager" : "lazy"}
              preload={preload}
              sizes="(max-width: 640px) "
              decoding="async"
            />
            <Image
              src={back?.url ?? front.url!}
              alt={back?.alternateName ?? front.alternateName}
              width={510}
              height={760}
              class=" absolute top-0 left-0  transition-opacity w-full max-h-[760px] object-cover opacity-0 group-hover:opacity-100"
              loading={preload ? "eager" : "lazy"}
              preload={preload}
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
          <h2 class="card-title w-full    text-[#2f2f2f] text-sm 2xl:text-lg  font-normal uppercase">
            {isVariantOf!.name}
          </h2>
          <div class="flex flex-col  sm:flew-row items-start ">
            <div class="hidden flew-row  items-start sm:flex flex-wrap">
              <span class="text-xs 2xl:text-base font-bold sm:flex hidden  ">
                {installmentText
                  ? (installmentText?.length === 8
                    ? (installmentText + ",00" + " / ")
                    : (installmentText?.length === 10
                      ? (installmentText + "0" + " / ")
                      : (installmentText + " / ")))
                  : ("")}
              </span>

              <span class="line-through px-1  text-xs 2xl:text-base  text-[#2f2f2f] sm:flex hidden">
                {listPrice !== price
                  ? (`${formatPrice(listPrice, offers!.priceCurrency!)} `)
                  : ("")}
              </span>
              <span class="text-xs 2xl:text-base  pr-1  font-bold text-black sm:flex hidden">
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

            <div class="flex flew-row  items-start sm:hidden flex-wrap">
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
    cards,
    ordem,
    horizontal,
    borderRadius,
    colorRed,
    itemListName,
    preload,
    productCard,
    size,
    desalinhamento,
    productCardMobileColum,
    sizeMobile,
  }: Omit<Props, "productCard"> & { productCard: ProductListingPage },
) {
  const id = useId();
  return (
    <>
      {ordem === "Card/Movie/Text"
        ? (
          <div
            class={`flex flex-col  lg:flex-row gap-5 lg:gap-0 px-[25px] sm:px-[25px] pt-[10px]   lg:px-[50px] lg:pt-[100px] lg:min-h-[700px] justify-center ${
              HORIZONTAL[horizontal!]
            } `}
          >
            {cards! !== undefined
              ? (cards?.banner?.desalinhamento === true
                ? (
                  <div class={`flex lg:container flex-col`}>
                    <div
                      id={id}
                      class={`flex container  ${
                        productCardMobileColum === true
                          ? ("flex-col")
                          : ("flex-row")
                      } flex-wrap gap-5  lg:min-h-[700px]  lg:gap-20 w-full justify-center ${
                        HORIZONTAL[horizontal!]
                      } `}
                    >
                      {productCard !== undefined
                        ? (productCard!.products?.map((product, index) => (
                          <CardItem
                            product={product}
                            colorRed={colorRed}
                            itemListName={itemListName}
                            preload={preload}
                            size={size}
                            index={index}
                            desalinhamento={desalinhamento!}
                            sizeMobile={sizeMobile}
                          />
                        )))
                        : ("")}
                    </div>
                    <div
                      class={`flex container ${
                        DESALINHAMENTOBANNER[
                          cards?.banner?.desalinhamentoAltura!
                        ]
                      }`}
                    >
                      {cards?.banner !== undefined
                        ? (
                          <CardMovie
                            banner={cards?.banner!}
                            borderRadius={borderRadius}
                          />
                        )
                        : ("")}
                    </div>
                  </div>
                )
                : (
                  <div
                    id={id}
                    class={`flex container flex-row flex-wrap gap-5  lg:min-h-[700px]  lg:gap-20 w-full justify-center ${
                      HORIZONTAL[horizontal!]
                    } `}
                  >
                    {productCard !== undefined
                      ? (productCard!.products?.map((product, index) => (
                        <CardItem
                          product={product}
                          colorRed={colorRed}
                          itemListName={itemListName}
                          preload={preload}
                          size={size}
                          index={index}
                          desalinhamento={desalinhamento!}
                          sizeMobile={sizeMobile}
                        />
                      )))
                      : ("")}

                    {cards?.banner !== undefined
                      ? (
                        <CardMovie
                          banner={cards?.banner!}
                          borderRadius={borderRadius}
                        />
                      )
                      : ("")}
                  </div>
                ))
              : ("")}

            {cards?.text !== undefined
              ? (
                <div
                  id={id}
                  class={` flex`}
                >
                  <TextCamp
                    text={cards?.text!}
                  />
                </div>
              )
              : ("")}
          </div>
        )
        : (
          <div
            class={`flex flex-col   lg:flex-row gap-5 lg:gap-0 px-[25px] sm:px-[25px] pt-[10px]   lg:px-[50px] lg:pt-[40px] lg:min-h-[700px] w-full justify-center ${
              HORIZONTAL[horizontal!]
            } `}
          >
            {cards?.text !== undefined
              ? (
                <div
                  id={id}
                  class={` flex`}
                >
                  <TextCamp
                    text={cards?.text!}
                  />
                </div>
              )
              : ("")}
            {cards! !== undefined
              ? (cards?.banner?.desalinhamento === true
                ? (
                  <div class={`flex container flex-col`}>
                    <div
                      id={id}
                      class={`flex container flex-row flex-wrap gap-5  lg:min-h-[700px]  lg:gap-20 w-full justify-center ${
                        HORIZONTAL[horizontal!]
                      } `}
                    >
                      {productCard !== undefined
                        ? (productCard!.products?.map((product, index) => (
                          <CardItem
                            product={product}
                            colorRed={colorRed}
                            itemListName={itemListName}
                            preload={preload}
                            size={size}
                            index={index}
                            desalinhamento={desalinhamento!}
                            sizeMobile={sizeMobile}
                          />
                        )))
                        : ("")}
                    </div>
                    <div
                      class={`flex container ${
                        DESALINHAMENTOBANNER[
                          cards?.banner?.desalinhamentoAltura!
                        ]
                      }`}
                    >
                      {cards?.banner !== undefined
                        ? (
                          <CardMovie
                            banner={cards?.banner!}
                            borderRadius={borderRadius}
                          />
                        )
                        : ("")}
                    </div>
                  </div>
                )
                : (
                  <div
                    id={id}
                    class={`flex container flex-row flex-wrap gap-5  lg:min-h-[700px]  lg:gap-20 w-full justify-center ${
                      HORIZONTAL[horizontal!]
                    } `}
                  >
                    {cards?.banner !== undefined
                      ? (
                        <CardMovie
                          banner={cards?.banner!}
                          borderRadius={borderRadius}
                        />
                      )
                      : ("")}
                    {productCard !== undefined
                      ? (productCard!.products?.map((product, index) => (
                        <CardItem
                          product={product}
                          colorRed={colorRed}
                          itemListName={itemListName}
                          preload={preload}
                          size={size}
                          index={index}
                          desalinhamento={desalinhamento!}
                          sizeMobile={sizeMobile}
                        />
                      )))
                      : ("")}
                  </div>
                ))
              : ("")}
          </div>
        )}
    </>
  );
}

function BannerCardPosition(
  { productCard, ...props }: Props,
) {
  return <CardsCamps {...props} productCard={productCard!} />;
}

export default BannerCardPosition;
