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
  content: string;
  onClick: (e: MouseEvent) => Promise<void>;
}

const variants = {
  active: " bg-black text-white border-none",
  disabled:
    `relative after:absolute after:left-0 after:top-1/2 after:h-[1px] after:bg-red-800 after:w-full after:block after:-rotate-45 after:content-[""]`,
  default: "",
};

function Avatar({ content, variant = "default", onClick }: Props) {
  return (
    <div
      onClick={onClick}
      class="cursor-pointer avatar placeholder flex justify-center items-center max-h-[30px]"
    >
      <div
        class={`w-full flex justify-center items-center max-h-[26px] transform transition duration-300 hover:scale-150 p-1 "bg-[#161616] ring-[#161616] ${
          variants[variant]
        }`}
      >
        <span class="text-caption font-caption uppercase font-bold hover:font-extrabold px-1 ">
          {colors[content] ? "" : content?.substring(0, 3)}
        </span>
      </div>
    </div>
  );
}

export default Avatar;
