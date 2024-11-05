import { Picture, Source } from "deco-sites/std/components/Picture.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import Image from "apps/website/components/Image.tsx";
import { FnContext } from "deco/mod.ts";

/**
@titleBy alt
*/
export interface Banner {
  srcMobile: LiveImage;
  srcDesktop?: LiveImage;
  /**
   * @description Image alt text
   */
  alt: string;
  /**
   * @description When you click you go to
   */
  href: string;
  /**
   * @description It will shrink the image to fit the container
   */
  shrink: boolean;
  /**
   * @description It will set the number of columns for the image
   */
  size_cols: number;

  /**
   * @description It will set the number of rows for the image
   */
  size_rows: number;
  /**
   * @description Must be used in the main image of the group
   */
  preload?: boolean;
}

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
  title?: string;
  /**
   * @description Default is 2 for mobile and all for desktop
   */
  itemsPerLine: {
    /** @default 2 */
    mobile?: 1 | 2;
    /** @default 5 */
    desktop?: 1 | 2 | 5 | 4 | 6 | 8 | 10;
  };
  /**
   * @description Item's border radius in px
   */
  borderRadius: {
    /** @default none */
    mobile?: BorderRadius;
    /** @default none */
    desktop?: BorderRadius;
  };
  banners: Banner[];
}

const MOBILE_COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
};

const DESKTOP_COLUMNS = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
  8: "sm:grid-cols-8",
  10: "sm:grid-cols-10",
};

interface Size {
  [inedx: number]: string;
}

const IMAGE_SIZE: Size = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  6: "sm:col-span-6",
};

const ROW_SIZE: Size = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
  4: "row-span-4",
  6: "row-span-6",
};

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

export default function BawBannner({
  title,
  itemsPerLine,
  borderRadius,
  banners = [],
  device,
}: ReturnType<typeof loader>) {
  return (
    <section class="w-full  md:pl-2 mx-auto md:pr-[42px]">
      <div
        class={` sm:px-4 sm:py-2 grid  grid-flow-row-dense  gap-4 md:gap-4  ${
          MOBILE_COLUMNS[itemsPerLine.mobile ?? 2]
        } ${DESKTOP_COLUMNS[itemsPerLine.desktop ?? 4]}`}
      >
        {banners.map((
          {
            href,
            srcMobile,
            srcDesktop,
            alt,
            size_cols,
            size_rows,
            preload = false,
          },
          index,
        ) => (
          <a
            href={href}
            class={`${IMAGE_SIZE[size_cols ?? 2]} ${ROW_SIZE[size_rows ?? 1]} ${
              index === 1 ? ("px-[30px] py-[20px] lg:px-0 lg:py-0") : ("")
            } transform transition duration-500 hover:scale-95  `}
          >
            {device !== "desktop" && (
              <Image
                media="(max-width: 767px)"
                src={srcMobile}
                width={index >= 3 ? 443 : 390}
                height={443}
                preload={index === 0 ? true : false}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                class={index > 1
                  ? "hidden sm:block text-center  "
                  : "w-full flex "}
              />
            )}
            {device === "desktop" && (
              <Image
                media="(min-width: 768px)"
                src={srcDesktop ? srcDesktop : srcMobile}
                width={index >= 3 ? 443 : 390}
                height={443}
                preload={index === 0 ? true : false}
                fetchPriority={index === 0 ? "high" : "auto"}
                loading={index === 0 ? "eager" : "lazy"}
                class={index > 1
                  ? "hidden sm:block text-center w-full"
                  : "w-full flex "}
              />
            )}
          </a>
        ))}
      </div>
    </section>
  );
}

export const loader = (props: Props, req: Request, ctx: FnContext) => {
  return {
    ...props,
    device: ctx.device || "desktop",
  };
};
