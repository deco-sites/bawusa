import { useUI } from "../../sdk/useUI.ts";

function GridListToggle() {
  const { listingType } = useUI();

  return (
    <div class="lg:flex hidden">
      <span class="p-1 font-bold mt-[10px] text-base">Visualização</span>
      <button
        onClick={() => {
          listingType.value = "2";
        }}
        class={`px-1 h-[30px] w-[30px] mt-[12px] font-semibold ${
          listingType.value === "2" ? ("bg-black text-white") : ("")
        } hover:font-bold hover:bg-black hover:text-white cursor-pointer m-1`}
        aria-label={"2"}
      >
        <p
          class={`${
            listingType.value === "2" ? "text-white" : "text-gray-icon"
          } hidden sm:block text-sm`}
        >
          2
        </p>
      </button>
      <button
        onClick={() => listingType.value = "4"}
        aria-label={"4"}
        class={`px-1 h-[30px] w-[30px] mt-[12px] font-semibold ${
          listingType.value === "4" ? ("bg-black text-white") : ("")
        } hover:font-bold hover:bg-black hover:text-white cursor-pointer m-1`}
      >
        <p
          class={`${
            listingType.value === "4" ? "text-white" : "text-gray-icon"
          } hidden sm:block text-sm`}
        >
          4
        </p>
      </button>
      <button
        aria-label={"6"}
        onClick={() => listingType.value = "6"}
        class={`px-1 h-[30px] w-[30px] mt-[12px] font-semibold ${
          listingType.value === "6" ? ("bg-black text-white") : ("")
        } hover:font-bold hover:bg-black hover:text-white cursor-pointer m-1`}
      >
        <p
          class={`${
            listingType.value === "6" ? "text-white" : "text-gray-icon"
          } hidden sm:block text-sm`}
        >
          6
        </p>
      </button>
    </div>
  );
}

export default GridListToggle;
