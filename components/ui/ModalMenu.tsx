import { useId } from "$store/sdk/useId.ts";
import { useSignal } from "@preact/signals";
import { ComponentChildren } from "preact";
import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";
import { useEffect, useState } from "preact/hooks";
import Button from "$store/components/ui/Button.tsx";
import Icon from "site/components/ui/Icon.tsx";
import Buttons from "$store/components/header/Buttons.tsx";
import Searchbar from "../search/Searchbar.tsx";
import ButtonLogin from "$store/components/ui/ButtonLogin.tsx";

interface Props {
  onClose?: () => void;
  open?: boolean;
  class?: string;
  children?: ComponentChildren;
  loading?: "eager" | "lazy";
}

function Modal(props: Props) {
  const {
    children,
    open,
    onClose,
    class: _class = "",
    loading = "lazy",
  } = props;
  const { user } = useUser();
  const isUserLoggedIn = Boolean(user.value?.email);

  const lazy = useSignal(loading === "lazy" && !open);
  const id = useId();

  useEffect(() => {
    const handler = (e: KeyboardEvent) =>
      (e.key === "Escape" || e.keyCode === 27) && open && onClose?.();

    addEventListener("keydown", handler);

    return () => {
      removeEventListener("keydown", handler);
    };
  }, [open]);

  useEffect(() => {
    lazy.value = false;
  }, []);

  return (
    <>
      <input
        id={id}
        checked={open}
        type="checkbox"
        class="modal-toggle"
        onChange={(e) => e.currentTarget.checked === false && onClose?.()}
      />
      <div class="modal">
        <div class={`modal-box ${_class}`}>
          <header class="flex px-4 py-6 justify-between items-center bg-[#f4f4f4] ">
            <Button
              class="bg-transparent hover:bg-transparent  border-none p-0 m-0 w-[30px] text-black"
              onClick={onClose}
              aria-label={"XMark"}
            >
              <Icon id="XMark" width={32} height={32} strokeWidth={2} />
            </Button>

            <a
              href="/"
              class="flex-grow inline-flex items-center"
              style={{ minHeight: 70 }}
              aria-label="Store logo"
            >
              <img
                src="https://bawclothing.vtexassets.com/assets/vtex/assets-builder/bawclothing.theme/4.5.11/icons/logo___043f201c675b2c2939f6d4796ccf0144.svg"
                width="50"
                class="shrink-0 w-full h-[27px]"
                alt="Logo Baw"
                loading="lazy"
                preload={"false"}
              />
            </a>

            <div class="flex gap-1">
              {/* <Buttons variant="search" /> */}
              <Buttons variant="cart" />
            </div>
          </header>

          <div class="bg-[#f4f4f4] flex flex-row w-full justify-between items-center px-4 pb-3  gap-4">
            <div class="flex flex-row justify-center items-center transform transition   duration-100 hover:scale-110">
              {isUserLoggedIn ? <ButtonLogin /> : (
                <a
                  class="bg-transparent hover:bg-transparent  border-none p-0 m-0 w-[30px]"
                  href="/login"
                  aria-label="Log in"
                >
                  <Icon id="BawLogin" width={32} height={32} strokeWidth={1} />
                </a>
              )}
              <span class="text-[12px] ">MINHA CONTA</span>
            </div>
            <div class="flex flex-row justify-center items-center transform transition   duration-100 hover:scale-110">
              <a
                class="bg-transparent hover:bg-transparent  border-none p-0 m-0 w-[30px] mr-1"
                aria-label="Orders"
              >
                <img
                  src="https://bawclothing.vtexassets.com/assets/vtex/assets-builder/bawclothing.theme/4.5.13/icons/iconMyOrders___43cd4a2fbf8e478ca5a5fc5f999af1d4.svg"
                  width="50"
                  class="shrink-0 w-[32px] h-[32px]"
                  alt={"Logo Baw"}
                  loading="lazy"
                  preload={"false"}
                />
              </a>
              <span class="text-[12px] ">MEUS PEDIDOS</span>
            </div>
            <div class="flex flex-row justify-center items-center transform transition   duration-100 hover:scale-110">
              <a
                class="bg-transparent hover:bg-transparent  border-none p-0 m-0 w-[30px] mr-1"
                href="/wishlist"
                aria-label="Wishlist"
              >
                <Icon
                  id="Heart"
                  width={32}
                  height={32}
                  strokeWidth={1}
                  fill="none"
                />
              </a>
              <span class="text-[12px] ">MEUS LIKES</span>
            </div>
          </div>
          <div class="w-full bg-[#f4f4f4]">
            <Searchbar />
          </div>
          {!lazy.value && children}
        </div>
        <label class="modal-backdrop" for={id}>Close</label>
      </div>
    </>
  );
}

export default Modal;
