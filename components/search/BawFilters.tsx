import Avatar from "$store/components/ui/Avatar.tsx";
import { parseRange } from "deco-sites/std/utils/filters.ts";
import { formatPrice } from "$store/sdk/format.ts";
import { useEffect, useState } from "preact/hooks";
import { AvailableIcons } from "$store/components/ui/Icon.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import MultiRangeSlider from "$store/components/ui/PriceSlider.tsx";

import type {
  Filter,
  FilterToggle,
  FilterToggleValue,
  ProductListingPage,
} from "apps/commerce/types.ts";

interface Props {
  filters: ProductListingPage["filters"];
}

const isToggle = (filter: Filter): filter is FilterToggle =>
  filter["@type"] === "FilterToggle";

function ValueItem(
  { url, selected, label, quantity }: FilterToggleValue,
) {
  return (
    <a href={url} rel="nofollow" class="flex items-center gap-2 mb-2">
      <div
        class={`checkbox ${
          selected ? "bg-black" : "bg-gray-200"
        }  rounded-none border-none`}
      />
      <span class="text-sm ">{label}</span>
      {quantity > 0 && <span class="text-sm  text-[#2f2f2f]">({quantity})
      </span>}
    </a>
  );
}

function FilterValues(props: { filter: FilterToggle; isOpen: boolean }) {
  const { key, values } = props.filter;
  const flexDirection = key === "avatar" ? "flex-row" : "flex-col";

  if (key === "price") {
    //parsing range values for price filter
    const valuesArray = Object.entries(values);

    const url = valuesArray[0][1].url;

    const urlPrice = url.split("&").slice(0, -1).filter((r) =>
      r.includes("filter.price")
    )[0]?.split("=")[1]?.split("%3A");
    const urlBrowser = url.split("&").slice(0, -1).filter((r) =>
      !r.includes("filter.price")
    ).join("&");
    const rangeArray: number[] = [];

    valuesArray.map((value) => {
      const aux = value[1].value.split(":");
      const auxArr = aux.map((r) => parseInt(r));
      rangeArray.push(...auxArr);
    });
    rangeArray.sort((a, b) => a - b);
    const minRange = rangeArray[0];
    const maxRange = rangeArray[rangeArray.length - 1];

    const [currentMaxMin, setCurrentMaxMin] = useState({
      max: urlPrice ? parseInt(urlPrice[1]) : maxRange,
      min: urlPrice ? parseInt(urlPrice[0]) : minRange,
    });

    let timeOutId = 0;
    let firstTime = 0;

    return (
      <div class={`${!props.isOpen && "hidden"} h-16 mt-4`}>
        <MultiRangeSlider
          min={minRange}
          max={maxRange}
          currentMin={currentMaxMin.min}
          currentMax={currentMaxMin.max}
          onChange={(query: { min: number; max: number }) => {
            if (
              currentMaxMin.max != query.max || currentMaxMin.min != query.min
            ) {
              if (firstTime > 0) {
                clearTimeout(timeOutId);
                timeOutId = setTimeout(() => {
                  setCurrentMaxMin({ max: query.max, min: query.min });
                  window.location.href = urlBrowser + "&filter.price=" +
                    query.min + "%3A" + query.max;
                }, 500);
              }
              firstTime++;
            }
          }}
        />
      </div>
    );
  }

  return (
    <ul class={`flex flex-wrap gap-2 ${flexDirection}`}>
      {values.map((item) => {
        const { url, selected, value } = item;

        if (key === "avatar") {
          return (
            <a href={url} rel="nofollow">
              <Avatar
                content={value}
                variant={selected ? "active" : "default"}
              />
            </a>
          );
        }

        if (key === "price") {
          const range = parseRange(item.value);

          return range && (
            <div>
              <ValueItem
                {...item}
                label={`${formatPrice(range.from)} - ${formatPrice(range.to)}`}
              />
            </div>
          );
        }

        return <ValueItem {...item} />;
      })}
    </ul>
  );
}

interface FilterIconInterface {
  [key: string]: AvailableIcons;
}

function FilterIcon({ key }: FilterToggle) {
  const icons = [
    "modelo",
    "cor",
    "tamanho",
    "estilo",
  ];

  return (
    <span class={icons.includes(key) ? "w-[37px] mr-3" : ""}>
      {key === "modelo" ? <Icon width={25} height={24} id="Modelo" /> : ""}
      {key === "cor" ? <Icon width={27} height={23} id="Cor" /> : ""}
      {key === "tamanho" ? <Icon width={37} height={23} id="Tamanho" /> : ""}
      {key === "estilo" ? <Icon width={33} height={27} id="Estilo" /> : ""}
    </span>
  );
}

function BawFilter(filter: FilterToggle) {
  const isSelected = filter.values.filter((value) => value.selected).length > 0;
  const [isOpen, setIsOpen] = useState(isSelected || false);
  const { key, quantity } = filter;

  if (key === "price") {
    setIsOpen(true);
  }

  function toggle() {
    setIsOpen(!isOpen);
  }

  const unused_categories = ["category-1", "category-2", "brand"];
  if (
    unused_categories.includes(key) || (key == "category-3" && quantity == 1)
  ) {
    return null;
  }
  return (
    <li class="flex flex-col gap-4">
      <div
        class="flex justify-between relative cursor-pointer items-center pt-2 pr-5"
        onClick={() => toggle()}
      >
        <span class="flex font-semibold text-xl justify-center items-center">
          <FilterIcon {...filter} />
          {key === "price" ? "Faixa de Preço" : filter.label}
        </span>
        {key !== "price" && (
          <Icon
            class="flex items-center"
            size={15}
            id={isOpen ? "ChevronUp" : "ChevronDown"}
            strokeWidth={3}
          />
        )}
      </div>
      <div
        class={`grid border-solid border-b border-gray-200 ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        } transition-[grid-template-rows] duration-600 ease-in-out`}
      >
        <div class={`overflow-y-auto overflow-x-hidden max-h-[400px]`}>
          <FilterValues filter={{ ...filter }} isOpen={isOpen} />
        </div>
      </div>
    </li>
  );
}

function BawFilters({ filters }: Props) {
  return (
    <div>
      <ul class="flex-col gap-2 p-4 flex">
        {filters
          .filter(isToggle)
          .map((filter) => <BawFilter {...filter} />)}
      </ul>
    </div>
  );
}

export default BawFilters;
