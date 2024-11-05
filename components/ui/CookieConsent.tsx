import Button from "$store/components/ui/Button.tsx";
import { useId } from "preact/hooks";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";

const script = (id: string) => `
const callback = () => {
  const KEY = 'store-cookie-consent';
  const ACCEPTED = 'accepted';
  const HIDDEN = "translate-y-[200%]";
  
  const consent = localStorage.getItem(KEY);
  const elem = document.getElementById("${id}");
  
  if (consent !== ACCEPTED) {
    elem.querySelector('[data-button-cc-accept]').addEventListener('click', function () {
      localStorage.setItem(KEY, ACCEPTED);
      elem.classList.add(HIDDEN);
    });
    elem.querySelector('[data-button-cc-close]').addEventListener('click', function () {
      elem.classList.add(HIDDEN);
    });
    elem.classList.remove(HIDDEN);
  }
};

window.addEventListener('scroll', callback, { once: true });
`;

export interface Props {
  image?: LiveImage | undefined;
}
function CookieConsent({ image }: Props) {
  const id = `cookie-consent-${useId()}`;

  return (
    <>
      <div
        id={id}
        class="transform-gpu translate-y-[200%] transition fixed sm:top-0 bottom-4 w-screen z-50"
      >
        <div class="container  px-4 py-4 rounded border border-base-200 flex flex-col max-w-[90vw] sm:max-w-[400px] gap-4 items-start sm:items-center shadow bg-base-100">
          <div class="flex flex-row">
            <img
              class="w-[50px] sm:w-[100px] mr-4"
              src={"https://dito-browser-notification-images.s3.amazonaws.com/MjAyMC0wMy0yNCAxMTo0OToxNyAtMDMwMEJhdyBDbG90aGluZyBPZmljaWFsODc5/modal/1587406327-logo%2080.jpg"}
              alt="logo"
            />
            <span class="flex-grow text-sm sm:text-lg font-medium text-black mb-2">
              Quer receber notificações das nossas campanhas, lançamentos e
              promoções antes de todo mundo?
            </span>
          </div>
          <div class="flex flex-row gap-2 w-full sm:w-auto">
            <Button
              data-button-cc-close
              class="btn-outline rounded-sm max-h-[30px] py-0  mr-5 px-5 w-[120px] border-none transition duration-75 hover:bg-[#7a7a7a]"
            >
              NÃO
            </Button>
            <Button
              data-button-cc-accept
              class=" bg-[#444] rounded-sm text-white  max-h-[30px] py-0  px-5 w-[120px] border-none transition duration-75 hover:bg-[#7a7a7a]"
            >
              SIM!
            </Button>
          </div>
        </div>
      </div>
      <script type="module" dangerouslySetInnerHTML={{ __html: script(id) }} />
    </>
  );
}

export default CookieConsent;
