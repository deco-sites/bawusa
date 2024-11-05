import { Signal, useSignal } from "@preact/signals";
import { invoke } from "../runtime.ts";
import type { StoreLocation } from "../types/storeLocation.ts";

export interface Form {
  storeCep: string;
}

const handleCepSend = async (storeCep: string): Promise<StoreLocation[]> => {
  try {
    const data = await invoke["site"].loaders
      .getPickupPointsByCep({ storeCep });
    return data.map((item) => ({
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
    console.error(error);
    return [];
  }
};

const formatCep = (cep: string) => {
  cep = cep.replace(/\D/g, "");
  if (cep.length > 8) cep = cep.substring(0, 8);
  if (cep.length > 5) cep = `${cep.substring(0, 5)}-${cep.substring(5)}`;
  return cep;
};

export default function StorePageCep(
  { mapStoresSignal, showMapSignal, noStoresFoundSignal }: {
    mapStoresSignal: Signal<StoreLocation[]>;
    showMapSignal: Signal<boolean>;
    noStoresFoundSignal: Signal<boolean>;
  },
) {
  const form = useSignal<Form>({ storeCep: "" });
  const loading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    loading.value = true;
    try {
      const items = await handleCepSend(form.value.storeCep);
      mapStoresSignal.value = items;
      showMapSignal.value = items.length > 0;
      noStoresFoundSignal.value = items.length === 0;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
      form.value = { storeCep: "" };
    }
  };

  return (
    <form onSubmit={handleSubmit} class="w-full">
      <div class="mb-4">
        <label class="block text-base font-medium mb-2" htmlFor="postal-code">
          Pesquise por CEP
        </label>
        <div class="flex items-center flex-col md:flex-row">
          <input
            id="postal-code"
            type="text"
            placeholder="00000-000"
            class="flex-grow p-2 border-b border-black focus:outline-none cursor-pointer mb-4 md:mb-0 md:mr-4 w-full md:w-auto"
            value={form.value.storeCep}
            onChange={(e) => {
              const formattedCep = formatCep(e.currentTarget.value);
              form.value = { ...form.value, storeCep: formattedCep };
            }}
          />
          <button
            type="submit"
            class="w-full md:w-auto bg-black font-bold text-white px-14 py-3 rounded-none cursor-pointer flex items-center justify-center"
            disabled={loading.value}
          >
            <span class="flex items-center justify-center w-full h-full md:w-auto">
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
