/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */

import { RefObject, useEffect, useRef } from "preact/compat";
import { useState } from "preact/hooks";
import Icon from "$store/components/ui/Icon.tsx";
import Button from "$store/components/ui/Button.tsx";
import Spinner from "$store/components/ui/Spinner.tsx";
import ProductCard from "$store/components/product/ProductCard.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import { useAutocomplete } from "apps/vtex/hooks/useAutocomplete.ts";
import { useUI } from "$store/sdk/useUI.ts";
import { AnalyticsEvent } from "apps/commerce/types.ts";
import { sendEvent } from "$store/sdk/analytics.tsx";

function closeSearchOutsideClick(
  ref: RefObject<HTMLDivElement>,
  close: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: Event) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        close();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

function CloseButton() {
  const { displaySearchbar } = useUI();

  return (
    <Button
      class="bg-transparent p-0 m-0 w-[28px] border-none justify-center items-center text-black hover:bg-transparent transform transition  duration-100 hover:scale-125"
      onClick={() => (displaySearchbar.value = false)}
      aria-label={"xmark"}
    >
      <Icon id="XMark" width={20} height={20} strokeWidth={2} />
    </Button>
  );
}

// Editable props
export interface EditableProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /**
   * @title Page path
   * @description When user clicks on the search button, navigate it to
   * @default /s
   */
  action?: string;
  /**
   * @title Term name
   * @description Querystring param used when navigating the user
   * @default q
   */
  name?: string;
  /**
   * TODO: Receive querystring from parameter in the server-side
   */
  query?: string;
}

export type Props = EditableProps & {
  variant?: "desktop" | "mobile";
};

function Searchbar({
  placeholder = "O que você está procurando?",
  action = "/s",
  name = "q",
  query,
  variant = "mobile",
}: Props) {
  const [term, setTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { setSearch, suggestions, loading } = useAutocomplete();
  const hasProducts = Boolean(suggestions.value?.products?.length);
  const hasTerms = Boolean(suggestions.value?.searches?.length);
  const notFound = !hasProducts && !hasTerms;
  const searchBoxRef = useRef<HTMLInputElement>(null);
  closeSearchOutsideClick(searchBoxRef, () => {
    setTerm("");
  });

  return (
    <div ref={searchBoxRef} class="flex flex-col md:px-2 relative z-50  ">
      <div class="flex items-center gap-4 justify-center">
        <form
          id="searchbar"
          action={action}
          class="flex-grow flex px-5 py-2 border-b w-[90%] justify-center bg-white"
        >
          <input
            ref={searchInputRef}
            id="search-input"
            class="flex-grow outline-none placeholder-shown:sibling:hidden bg-transparent placeholder-black   border-b border-black"
            name={name}
            defaultValue={query}
            onInput={(e) => {
              const value = e.currentTarget.value;

              if (value) {
                sendEvent({
                  name: "search",
                  params: { search_term: value },
                });
                setTerm(value);
              }

              setSearch(value, 6);
            }}
            placeholder={placeholder}
            role="combobox"
            autocomplete="off"
          />
          <Button
            class="bg-transparent hover:bg-transparent border-t-0 border-l-0 border-r-0 rounded-none border-b border-black"
            aria-label="Search"
            htmlFor="searchbar"
            tabIndex={-1}
          >
            <Icon
              class=" text-[#2f2f2f]"
              id="MagnifyingGlass"
              size={20}
              strokeWidth={0.01}
            />
          </Button>
        </form>
        {variant === "desktop" && <CloseButton />}
      </div>
      {term.length > 0
        ? (
          <div class="fixed flex top-[230px] left-0 pl-[30px] w-full h-full  bg-gradient-to-b from-[#00000000]    to-[#00000065]    flex-col gap-3 divide-y justify-start items-start  divide-base-200 empty:mt-0 md:flex-row md:divide-y-0 ">
            <div class="fixed top-[235px]  w-[80vw]  sm:max-w-[480px] pl-1 pb-10  flex flex-col gap-3 divide-y divide-base-200 empty:mt-0   bg-gray-100 ">
              {notFound
                ? (
                  <div class="flex flex-col  w-[90%] items-center p-4 ">
                    <span class="text-[7rem]  text-[#ccc]  w-full font-extrabold ">
                      Oops!
                    </span>
                    <span class="sm:mt-[-90px] text-[16px] w-full  text-black font-extrabold">
                      Nenhum produto foi encontrado
                    </span>
                  </div>
                )
                : (
                  <>
                    <div class="bg-gray-100 flex flex-col md:w-[200px] md:max-w-[200px] pl-2">
                      <div class="flex gap-1  items-center ">
                        <span
                          class="font-medium text-sm text-center pb-[6px]"
                          role="heading"
                          aria-level={3}
                        >
                          Pesquisas
                        </span>
                        {loading.value && <Spinner />}
                      </div>
                      <ul id="search-suggestion" class="flex flex-col gap-2">
                        {suggestions.value!.searches?.map(({ term }) => (
                          <li>
                            <a
                              href={`/s?q=${term}`}
                              class="flex gap-1 items-center"
                            >
                              <span class="uppercase text-sm">{term}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div class="flex flex-col pt-2  gap-3 overflow-x-hidden w-full">
                      <div class="flex gap-2 items-center">
                        <span
                          class="font-medium text-sm"
                          role="heading"
                          aria-level={3}
                        >
                          Sugestões
                        </span>
                        {loading.value && <Spinner />}
                      </div>
                      <Slider class="flex flex-row flex-wrap  gap-1 justify-start  max-h-[280px]">
                        {suggestions.value!.products?.map((product, index) => (
                          <Slider.Item
                            index={index}
                            class="carousel-item   min-w-[120px] max-w-[120px]"
                          >
                            <ProductCard product={product} />
                          </Slider.Item>
                        ))}
                      </Slider>
                    </div>
                  </>
                )}
            </div>
          </div>
        )
        : null}
    </div>
  );
}

export default Searchbar;
