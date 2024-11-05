import { Picture, Source } from "deco-sites/std/components/Picture.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import Image from "apps/website/components/Image.tsx";

export interface Props {
  desktop: LiveImage;
  width: number;
  height: number;
  alt: string;
  preload?: boolean;
}

function BannerFull({ alt, desktop, preload, width, height }: Props) {
  return (
    <div class="w-full px-auto lg:max-w-none sm:m-0 lg:overflow-hidden lg:pr-[40px]">
      <Picture
        preload
        class="col-start-1 col-span-1 row-start-1 row-span-1"
      >
        {desktop
          ? (
            <Source
              src={desktop}
              width={width || 1920}
              height={height || 1000}
              class="flex"
            />
          )
          : ("")}
        {desktop
          ? (
            <Image
              class="w-full"
              loading={preload ? "eager" : "lazy"}
              width={width || 1920}
              height={height || 1000}
              preload={preload}
              src={desktop}
              alt={alt}
            />
          )
          : ("")}
      </Picture>
    </div>
  );
}

export default BannerFull;
