import { Picture, Source } from "deco-sites/std/components/Picture.tsx";
import type { LoaderReturnType } from "$live/types.ts";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
/**
@titleBy matcher
*/
export interface Banner {
  /** @description RegExp to enable this banner on the current URL. Use /feminino/* to display this banner on feminino category  */
  matcher: string;
  /** @description text to be rendered on top of the image */
  title?: string;
  /** @description text to be rendered on top of the image */
  subtitle?: string;
  image: {
    /** @description Image for big screens */
    desktop?: LiveImage | undefined;
    width?: number;
    height?: number;
    /** @description Image for small screens */
    mobile?: LiveImage | undefined;
    /** @description image alt text */
    alt?: string;
    widthMobile?: number;
    heightMobile?: number;
  };
}

export interface Props {
  page?: LoaderReturnType<ProductListingPage | null>;
  banners?: Banner[];
}

function BannerUI({ banner }: { banner: Banner }) {
  const { title, subtitle, image } = banner;

  return (
    <>
      <div class="grid grid-cols-1 grid-rows-1">
        <Picture
          preload
          class="col-start-1 col-span-1 row-start-1 row-span-1"
        >
          {image?.mobile
            ? (
              <Source
                src={image?.mobile}
                width={image?.widthMobile || 360}
                height={image?.heightMobile || 120}
                media="(max-width: 767px)"
              />
            )
            : ("")}
          {image?.desktop
            ? (
              <Source
                src={image.desktop}
                width={image?.width || 1440}
                height={image?.height || 200}
                media="(min-width: 767px)"
              />
            )
            : ("")}

          {image?.desktop
            ? <img class="w-full" src={image.desktop} alt={image.alt} />
            : ("")}
        </Picture>
      </div>
      {title || subtitle
        ? (
          <div class="container flex flex-col items-center text-center justify-center sm:items-start col-start-1 col-span-1 row-start-1 row-span-1 w-full max-w-[660px] py-10 sm:gap-5 font-bold">
            {title && (
              <h1 class="w-full ">
                <span class="text-3xl sm:text-5xl uppercase font-medium text-black ">
                  {title}
                </span>
              </h1>
            )}
            {subtitle && (
              <span class="text-xs px-5 text-justify sm:text-center sm:text-sm font-medium text-[#5e5e5e] w-full ">
                {subtitle}
              </span>
            )}
          </div>
        )
        : null}
    </>
  );
}

/**
 * TODO: run the matcher agains the true URL instead on the breadcrumb.
 * This way we can remove the need for a loader. This can be done on live@1.x
 */
function Banner({ page, banners = [] }: Props) {
  if (!page || page.breadcrumb.itemListElement.length === 0) {
    return null;
  }

  const { item: canonical } = page
    .breadcrumb
    .itemListElement
    .reduce((curr, acc) => curr.position > acc.position ? curr : acc);

  const matching = banners.find(({ matcher }) =>
    new RegExp(matcher).test(canonical)
  );

  if (!matching) {
    return null;
  }

  return <BannerUI banner={matching} />;
}

export default Banner;
