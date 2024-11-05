import { HTML } from "deco-sites/std/components/HTMLRenderer.tsx";
import HTMLRenderer from "deco-sites/std/components/HTMLRenderer.tsx";
import { useState } from "preact/hooks";
import type { LoaderReturnType } from "$live/types.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
/**
@titleBy matcher
*/
export interface ReadMore {
  /** @description RegExp to enable this banner on the current URL. Use /feminino/* to display this banner on feminino category  */
  matcher: string;
  content: HTML;
}

export interface Props {
  page?: LoaderReturnType<ProductListingPage | null>;
  readMores?: ReadMore[];
}

function ReadMoreUI({ readMore }: { readMore: ReadMore }) {
  const [isShowing, setIsShowing] = useState(false);

  const { content } = readMore;

  const toggleShow = () => {
    setIsShowing(!isShowing);
  };

  return (
    <section class="w-full px-auto flex justify-center mb-[70px]">
      <div class="max-w-3xl">
        <div
          class={`transition-all duration-[1500ms] ${
            isShowing ? "max-h-fit" : "max-h-[70px]"
          } overflow-hidden text-gray-500 [&_ul]:pl-4 [&_ul]:mx-3 [&_ul]:list-disc [&_h1]:mt-3 [&_h2]:mt-3 [&_h3]:mt-3 [&_h4]:mt-3 [&_h5]:mt-3 [&_a]:text-blue-600 [&_a]:underline [&_a]:font-medium`}
        >
          <HTMLRenderer html={content} />
        </div>
        <div class="border-t pt-4 flex justify-center border-gray-300">
          <button
            class="bg-white rounded-none px-[16px] py-[2px] text-xs border border-black"
            onClick={() => toggleShow()}
          >
            {!isShowing ? "Ler Mais" : "Ler Menos"}
          </button>
        </div>
      </div>
    </section>
  );
}

function ReadMore({ page, readMores = [] }: Props) {
  if (!page || page.breadcrumb.itemListElement.length === 0) {
    return null;
  }

  const { item: canonical } = page
    .breadcrumb
    .itemListElement
    .reduce((curr, acc) => curr.position > acc.position ? curr : acc);

  const matching = readMores.find(({ matcher }) =>
    new RegExp(matcher).test(canonical)
  );

  if (!matching) {
    return null;
  }

  return <ReadMoreUI readMore={matching} />;
}

export default ReadMore;
