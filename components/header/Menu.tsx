import Icon from "$store/components/ui/Icon.tsx";
import type { INavItem } from "./NavItem.tsx";

export interface Props {
  items: INavItem[];
}

function MenuItem({ item }: { item: INavItem }) {
  if (item.children && item.children!.length > 0) {
    return (
      <div class="collapse collapse-arrow">
        <input type="checkbox" aria-label={item.label} />
        <label class="collapse-title uppercase">
          {item.label}
        </label>
        <div class="collapse-content">
          <ul class="text-[20px] border-none ">
            {item.children.map((node) => (
              <li>
                <a
                  class="uppercase text-[20x] border-none mb-3"
                  href={node.href}
                >
                  {node.label}
                  {node.tagAsNew && (
                    <span class="bg-red-500 py-[1px] px-0.5 rounded-md text-white text-xs ml-1 align-middle">
                      NEW
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  } else {
    return <a class="leading-5 p-4 block" href={item.href}>{item.label}</a>;
  }
}

function Menu({ items }: Props) {
  return (
    <ul class="px-4 flex-grow flex flex-col divide-y divide-base-200 mt-10">
      {items.map((item) => (
        <li>
          <MenuItem item={item} />
        </li>
      ))}
    </ul>
  );
}

export default Menu;
