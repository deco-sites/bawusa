/**
 * This component renders the filter and selectors for skus.
 * TODO: Figure out a better name for this component.
 */

const colors: Record<string, string> = {
  "azul-clara": "bg-[#87CEFA] ring-[#87CEFA]",
  "azul-marinho": "bg-[#000080] ring-[#000080]",
  "branca": "bg-[#FFFFFF] ring-[#FFFFFF]",
  "cinza": "bg-[#808080] ring-[#808080]",
  "cinza-escura": "bg-[#A9A9A9] ring-[#A9A9A9]",
  "laranja": "bg-[#FFA500] ring-[#FFA500]",
  "marrom": "bg-[#A52A2A] ring-[#A52A2A]",
  "preta": "bg-[#161616] ring-[#161616]",
  "verde-clara": "bg-[#90EE90] ring-[#90EE90]",
  "vermelha": "bg-[#FF0000] ring-[#FF0000]",

  // Color variants - only applied when no color as content is passed
  "active": "bg-neutral-focus text-neutral-content ring-neutral-focus ",
  "disabled": "bg-neutral-content text-neutral",
  "default": "bg-neutral text-neutral-content",
};

interface Props {
  variant?: "active" | "disabled" | "default";
  image: string;
  onClick: (e: MouseEvent) => void;
}

const variants = {
  active: " bg-black text-white border-none",
  disabled:
    `relative  after:absolute after:left-0 after:top-1/2 after:h-[1px] after:bg-red-800 after:w-full after:block after:-rotate-45 after:content-[""]`,
  default: "",
};

function AvatarColor({ variant = "default", image, onClick }: Props) {
  return (
    <div
      class="cursor-pointer avatar placeholder flex justify-center items-center max-w-[25px]  "
      onClick={onClick}
    >
      <div
        class={`w-full flex justify-center p-[1px]  items-center w-full max-w-[25px] max-w-[25px] rounded-2xl overflow-hidden border ${
          variant == "active"
            ? "rounded-2xl w-full h-full border border-black"
            : "" +
              "rounded-2xl w-full h-full hover:border-[2px] hover:border-gray-700"
        }   `}
      >
        <img
          class={"rounded-2xl w-full h-full "}
          src={image}
          loading="lazy"
          alt="color-thumbnail"
        />
      </div>
    </div>
  );
}

export default AvatarColor;
