import { useId } from "preact/hooks";
import Image from "apps/website/components/Image.tsx";
import { Picture, Source } from "deco-sites/std/components/Picture.tsx";
import type { LoaderReturnType } from "$live/types.ts";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
import type { Video as LiveViedo } from "deco-sites/std/components/types.ts";

export type BorderRadius =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "full";

export interface Props {
  /** @default movie */
  /** @description Options  movie | image */

  type?: "movie" | "image";

  srcMovieMobile?: LiveViedo | LiveImage;
  srcMovieDesktop?: LiveViedo | LiveImage;
  /**
   * @description Movie alt text
   */
  altMovie?: string;
  /**
   * @description When you click you go to
   */
  hrefMovie?: string;

  borderRadius: {
    /** @default none */
    mobile?: BorderRadius;
    /** @default none */
    desktop?: BorderRadius;
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

function BannerMovieImg(
  { borderRadius, altMovie, hrefMovie, srcMovieDesktop, srcMovieMobile, type }:
    Props,
) {
  return (
    <>
      {type === "movie"
        ? (
          <section class="w-full px-auto sm:max-w-none sm:m-0 sm:overflow-hidden lg:pr-[40px]">
            <div>
              <a
                href={hrefMovie}
                class={`overflow-hidden ${
                  RADIUS_MOBILE[borderRadius.mobile ?? "none"]
                } ${RADIUS_DESKTOP[borderRadius.desktop ?? "none"]} `}
              >
                <div class="w-full h-full m-0 p-0 b">
                  <video
                    src={srcMovieDesktop}
                    alt={altMovie}
                    autoPlay
                    muted
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
                    src={srcMovieMobile}
                    alt={altMovie}
                    autoPlay
                    muted
                    loop
                    preload="auto"
                    webkit-playsinline
                    x5-playsinline
                    playsInline
                    class="sm:hidden w-full h-full inline-block"
                  >
                    Video não suportado!
                  </video>
                </div>
              </a>
            </div>
          </section>
        )
        : (
          <div class="w-full px-auto sm:max-w-none sm:m-0 sm:overflow-hidden pr-[40px]">
            <Picture
              preload
              class="col-start-1 col-span-1 row-start-1 row-span-1"
            >
              {srcMovieMobile
                ? (
                  <Source
                    src={srcMovieMobile}
                    width={375}
                    height={230}
                    media="(max-width: 767px)"
                  />
                )
                : ("")}
              {srcMovieDesktop
                ? (
                  <Source
                    src={srcMovieDesktop}
                    width={960}
                    height={600}
                    media="(min-width: 767px)"
                  />
                )
                : ("")}

              {srcMovieDesktop
                ? (
                  <img
                    class="w-full h-full"
                    src={srcMovieDesktop}
                    alt={altMovie}
                  />
                )
                : ("")}
            </Picture>
          </div>
        )}
    </>
  );
}

export default BannerMovieImg;
