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
      aria-label={"xMark"}
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
    <div ref={searchBoxRef} class="flex flex-col md:px-2 relative">
      <div class="flex items-center gap-4">
        <form
          id="searchbar"
          action={action}
          class="flex-grow flex gap-3 px-3 py-2"
        >
          <Button
            class="bg-transparent hover:bg-transparent transform transition  duration-100 hover:scale-125 border-none"
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
          <input
            ref={searchInputRef}
            id="header-search-input"
            class="flex-grow outline-none placeholder-shown:sibling:hidden bg-transparent placeholder-black "
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
            aria-controls="search-suggestion"
            autocomplete="off"
          />
        </form>
        {variant === "desktop" && <CloseButton />}
      </div>
      {term.length > 0
        ? (
          <div class="fixed flex top-[70px] right-[50px]  w-full h-full p-3  flex-col gap-6 divide-y divide-base-200 empty:mt-0 md:flex-row md:divide-y-0  bg-[#0000003b]">
            <div class="fixed top-[70px] right-[50px] max-w-[760px] w-full pb-10 pl-2 flex flex-col gap-6 divide-y divide-base-200 empty:mt-0 md:flex-row md:divide-y-0 bg-gray-100">
              {notFound
                ? (
                  <div class="  flex flex-col w-full  items-center ">
                    <span class="text-[8rem] sm:text-[10.5rem] text-[#ccc] font-extrabold ">
                      Oops!
                    </span>
                    <span class="sm:mt-[-60px] text-[20px] sm:text-[30px] text-black font-extrabold">
                      Nenhum produto foi encontrado
                    </span>
                  </div>
                )
                : (
                  <>
                    <div class="bg-gray-100 flex flex-col md:w-[200px] md:max-w-[200px] pl-2">
                      <div class="flex gap-2  items-center ">
                        <div onClick={() => setTerm("")}>
                          <CloseButton />
                        </div>

                        <span
                          class="font-medium text-xl text-center pb-[6px]"
                          role="heading"
                          aria-level={3}
                        >
                          Pesquisas
                        </span>
                        {loading.value && <Spinner />}
                      </div>
                      <ul id="search-suggestion" class="flex flex-col gap-6">
                        {suggestions.value!.searches?.map(({ term }) => (
                          <li>
                            <a
                              href={`/s?q=${term}`}
                              class="flex gap-4 items-center"
                            >
                              <span>
                                <Icon
                                  id="MagnifyingGlass"
                                  size={20}
                                  strokeWidth={0.01}
                                />
                              </span>
                              <span>{term}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div class="flex flex-col pt-6 md:pt-0 gap-3 overflow-x-hidden w-full">
                      <div class="flex gap-2 items-center">
                        <span
                          class="font-medium text-xl"
                          role="heading"
                          aria-level={3}
                        >
                          Sugestões
                        </span>
                        {loading.value && <Spinner />}
                      </div>
                      <Slider class="flex flex-row flex-wrap  gap-1 justify-start w-[600px]">
                        {suggestions.value!.products?.map((product, index) => (
                          <Slider.Item
                            index={index}
                            class="carousel-item   min-w-[170px] max-w-[170px]"
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
