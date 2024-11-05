import { Signal, useSignal } from "@preact/signals";
import { invoke } from "../runtime.ts";
import type { StoreLocation } from "../types/storeLocation.ts";
import { RefObject } from "preact";

export interface Form {
  stateUf: string;
}

const DEFAULT_PROPS = [
  { stateUF: "RJ", stateName: "Rio de Janeiro" },
  { stateUF: "SP", stateName: "São Paulo" },
];

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const handleStateSend = async (stateUf: string): Promise<StoreLocation[]> => {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const items = await invoke["site"].loaders
        .getPickupPointsByStateGql({ stateUf });
      return items.map((item) => ({
        ...item,
        instructions: item.instructions ?? "",
        address: {
          ...item.address,
          complement: item.address?.complement ?? null,
          reference: item.address?.reference ?? null,
          geoCoordinates: [
            item.address.geoCoordinates[0],
            item.address.geoCoordinates[1],
          ],
        },
        businessHours: item.businessHours.map((hour) => ({
          ...hour,
          openingTime: hour.openingTime,
          closingTime: hour.closingTime,
        })),
      }));
    } catch (error) {
      console.error(`Tentativa ${attempts + 1} falhou: ${error}`);
      attempts += 1;
      if (attempts < MAX_RETRIES) {
        await sleep(RETRY_DELAY * attempts);
      } else {
        console.error("Maximo de tentativas excedido");
      }
    }
  }

  return [];
};

export default function StorePageSelectStates(
  { mapStoresSignal, showMapSignal, searchButtonRef }: {
    mapStoresSignal: Signal<StoreLocation[]>;
    showMapSignal: Signal<boolean>;
    searchButtonRef: RefObject<HTMLButtonElement>;
  },
) {
  const form = useSignal<Form>({ stateUf: "" });
  const loading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    loading.value = true;
    try {
      const items = await handleStateSend(form.value.stateUf);
      mapStoresSignal.value = items;
      showMapSignal.value = true;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
      form.value = { stateUf: "" };
    }
  };

  return (
    <form class="w-full" onSubmit={handleSubmit}>
      <div class="mb-4">
        <label class="block text-base font-medium mb-2" htmlFor="state">
          Busque por uma loja específica
        </label>
        <div class="flex flex-col md:flex-row items-center">
          <select
            id="state"
            class="flex-grow p-2 border-b border-black focus:outline-none cursor-pointer mb-4 md:mb-0 md:mr-4 w-full md:w-auto"
            value={form.value.stateUf}
            onChange={(e) => {
              form.value = { ...form.value, stateUf: e.currentTarget.value };
            }}
          >
            <option value="">Selecione o Estado</option>
            {DEFAULT_PROPS.map((state, index) => (
              <option value={state.stateUF} key={index}>
                {state.stateName}
              </option>
            ))}
          </select>
          <button
            type="submit"
            ref={searchButtonRef}
            class="w-full md:w-auto bg-black font-bold text-white px-14 py-3 rounded-none cursor-pointer flex items-center justify-center"
            disabled={loading.value}
          >
            <span class="flex items-center justify-center w-full h-full">
              {loading.value
                ? <span class="loading loading-spinner text-white"></span>
                : (
                  "PESQUISAR"
                )}
            </span>
          </button>
        </div>
      </div>
    </form>
  );
}
