import Image from "apps/website/components/Image.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import Button from "./Button.tsx";
import { useId } from "preact/hooks";
import type { JSX } from "preact";
import { Children } from "preact/compat";
import SliderControllerJS from "$store/islands/SliderJS.tsx";

export interface Highlight {
  src: LiveImage;
  alt: string;
  href: string;
  buttonText: string;
}

export interface Props {
  highlights?: Highlight[];
  title?: string;
  interval?: number;
}
type SliderDotsProps = JSX.IntrinsicElements["ol"];

export function SliderDots({ children, class: _class }: SliderDotsProps) {
  return (
    <ol
      class={`flex items-center justify-center overflow-auto overscroll-contain snap-x snap-mandatory ${_class}`}
    >
      {Children.map(children, (child, index) => (
        <li class="snap-center">
          <button
            data-dot={index}
            aria-label={`go to slider item ${index}`}
            class="focus:outline-none group"
          >
            {child}
          </button>
        </li>
      ))}
    </ol>
  );
}
function ProgressiveDots({ highlights }: Props) {
  return (
    <SliderDots class="col-span-full w-min self-center justify-self-center gap-2  z-10 row-start-5  overflow-hidden lg:hidden">
      {highlights?.map(() => (
        <div>
          <div class="w-[84px] h-[5px] rounded bg-[#f2f2f2] group-disabled:bg-[#414042]" />
          {/* <div class="w-[10px] h-[10px]  rounded border border-[#414042]  group-disabled:bg-[#414042]" /> */}
        </div>
      ))}
    </SliderDots>
  );
}

function Highlights({ highlights = [], title, interval }: Props) {
  const id = useId();

  return (
    <div class="grid grid-cols-1 grid-rows-[48px_1fr] py-10">
      <h2 class="text-center text-transparent">
        <span class="font-medium text-2xl">{title}</span>
      </h2>

      <div class=" hidden lg:grid lg:grid-cols-1 lg:grid-cols-3 lg:gap-16 lg:px-10 ">
        {highlights.map(({ href, src, alt, buttonText }) => (
          <div class="bg-[#eaeaea]">
            <a href={href} class="bg-[#eaeaea] group">
              <figure class="relative">
                <Image
                  src={src}
                  alt={alt}
                  class="w-full"
                  loading={"lazy"}
                  preload={false}
                  width={600}
                  height={600}
                />
                <Button
                  aria-label={buttonText || "comprar agora"}
                  name="shop now"
                  class="
                bg-white 
                text-black 
                uppercase 
                border-none 
                rounded-none 
                text-xl
                px-8 
                group-hover:bg-white group-hover:scale-125 group-hover:rotate-[-3deg] group-hover:translate-y-[-3rem]
                absolute
                bottom-4
                mx-[20%]
                right-0
                left-0
                "
                >
                  {buttonText || "Comprar agora"}
                </Button>
              </figure>
            </a>
          </div>
        ))}
      </div>
      <div class="w-full lg:bg-[#cacbcc] flex justify-center lg:hidden">
        <div
          id={id}
          class=" relative grid px-4 lg:px-6 grid-cols-[48px_1fr_48px] lg:grid-cols-[120px_1fr_120px] grid-rows-[1fr_48px_1fr_48px_22px] lg:grid-rows-[1fr_48px_1fr_48px] max-w-[1280px] xl:px-0"
        >
          <Slider class="carousel col-span-full row-start-1 row-end-5 lg:row-span-full  scrollbar-none gap-6">
            {highlights?.map(({ href, src, alt, buttonText }, index) => (
              <Slider.Item
                index={index}
                class="carousel-item w-full flex justify-center"
              >
                <div class="bg-[#eaeaea] p-5 text-center">
                  <a href={href} class="bg-[#eaeaea] pb-6 group">
                    <figure class="relative">
                      <Image
                        src={src}
                        alt={alt}
                        class="w-full"
                        width={600}
                        height={600}
                        loading={"lazy"}
                        preload={false}
                      />
                      <Button
                        aria-label={buttonText || "comprar agora"}
                        class="
                bg-white 
                text-black 
                uppercase 
                border-none 
                rounded-none 
                text-xl
                px-8 
                group-hover:bg-white group-hover:scale-125 group-hover:rotate-[-3deg] group-hover:translate-y-[-3rem]"
                      >
                        {buttonText || "Comprar agora"}
                      </Button>
                    </figure>
                  </a>
                </div>
              </Slider.Item>
            ))}
          </Slider>

          <ProgressiveDots highlights={highlights} interval={interval} />

          <SliderControllerJS
            rootId={id}
            interval={interval && interval * 1e3}
          />
        </div>
      </div>
    </div>
  );
}

export default Highlights;
