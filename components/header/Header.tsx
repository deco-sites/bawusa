import Modals from "$store/islands/HeaderModals.tsx";
import type { Image } from "deco-sites/std/components/types.ts";
import type { EditableProps as SearchbarProps } from "$store/components/search/Searchbar.tsx";
import type { FnContext, LoaderReturnType } from "$live/types.ts";
import type { Product, Suggestion } from "apps/commerce/types.ts";
import { useDevice } from "$store/sdk/useDevice.ts";
import type { INavItem } from "./NavItem.tsx";
import Alert from "./Alert.tsx";
import Navbar from "./Navbar.tsx";
import Sidebar from "./Sidebar.tsx";
import { headerHeight } from "./constants.ts";

export interface NavItem {
  label: string;
  href: string;
  colorRed: boolean;
  children?: Array<{
    label: string;
    href: string;
    tagAsNew?: boolean;
    children?: Array<{
      label: string;
      href: string;
    }>;
  }>;
}

export interface Props {
  // alerts: string[];
  /** @title Search Bar */
  searchbar?: SearchbarProps;
  /**
   * @title Navigation items
   * @description Navigation items used both on mobile and desktop menus
   */
  navItems?: NavItem[] | undefined;

  /**
   * @title Product suggestions
   * @description Product suggestions displayed on search
   */
  products?: LoaderReturnType<Product[] | null>;

  /**
   * @title Enable Top Search terms
   */
  suggestions?: LoaderReturnType<Suggestion | null>;
}

function Header({
  // alerts,
  searchbar: _searchbar,
  products,
  navItems,
  suggestions,
}: ReturnType<typeof loader>) {
  const searchbar = { ..._searchbar, products, suggestions };
  const { deviceSignal } = useDevice();
  const device = deviceSignal.value;
  return (
    <>
      <header style={{ height: headerHeight }}>
        <div class="fixed w-full z-50 bg-gradient-to-r from-white to-gray-100">
          {navItems && (
            <Navbar
              items={navItems as INavItem[]}
              searchbar={searchbar}
              device={device}
            />
          )}
        </div>
        <div class="hidden md:fixed md:flex bg-white z-50 right-0 top-[70px] w-[50px]">
          {navItems && (
            <Sidebar items={navItems as INavItem[]} searchbar={searchbar} />
          )}
        </div>
        {/* <Alert alerts={alerts} /> */}

        {navItems && (
          <Modals
            menu={{ items: navItems as INavItem[] }}
            searchbar={searchbar}
          />
        )}
      </header>
    </>
  );
}

export const loader = (props: Props, req: Request, ctx: FnContext) => {
  const { deviceSignal } = useDevice();
  deviceSignal.value = ctx.device || "desktop";
  return {
    ...props,
  };
};

export default Header;
