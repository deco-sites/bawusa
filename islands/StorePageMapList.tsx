import { h } from "preact";
import { Signal } from "@preact/signals";
import type { StoreLocation } from "../types/storeLocation.ts";
import IconArrowNarrowLeft from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/arrow-narrow-left.tsx";
interface MapStores {
  mapStoresSignal: Signal<StoreLocation[]>;
  selectedStoreSignal: Signal<StoreLocation | null>;
  showMapSignal: Signal<boolean>;
}

function formatPhoneNumber(phone: string) {
  const match = phone.match(/^(\d{2})-(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

export default function StorePageMapList(
  { mapStoresSignal, selectedStoreSignal, showMapSignal }: MapStores,
) {
  const items = mapStoresSignal.value;
  const selectedStore = selectedStoreSignal;

  const handleClick = (store: StoreLocation) => {
    selectedStore.value = store;
  };

  const handleBack = () => {
    mapStoresSignal.value = [];
    selectedStoreSignal.value = null;
    showMapSignal.value = false;
  };

  return (
    <div class="w-full md:w-1/4 min-w-[364px] h-[80vh] overflow-y-auto">
      <a
        onClick={handleBack}
        href={"#"}
        className="text-sm font-bold mb-4 flex items-center cursor-pointer"
      >
        <IconArrowNarrowLeft class="w-6 h-6 mr-2" />
        VOLTAR AO LOCALIZADOR DE LOJAS
      </a>
      {items.length > 0
        ? (
          <>
            <h1 className="text-3xl font-bold mb-4">
              {items.length} loja{items.length > 1 ? "s" : ""} próxima a{" "}
              {items[0].address.city}:
            </h1>
            <h1 className="text-xl font-bold mb-4">Resultados disponíveis:</h1>
            <p className="mb-4">
              Selecione abaixo qual das lojas você está buscando.
            </p>
            {items.map((store, index) => (
              <div
                key={index}
                className="border border-black p-4 mb-4 hover:bg-[#182027] cursor-pointer hover:text-white transition-colors duration-300"
                onClick={() => handleClick(store)}
              >
                <h2 className="font-bold text-lg mb-2">{store.name}</h2>
                <p className="mb-2">
                  {store.address.street}, {store.address.number},{" "}
                  {store.address.complement ?? ""} -{" "}
                  {store.address.neighborhood}, {store.address.city} -{" "}
                  {store.address.state}, {store.address.postalCode}
                </p>
                <p className="mb-2">
                  <strong>Telefone:</strong>{" "}
                  {formatPhoneNumber(store.instructions.trim() || "-")}
                </p>
                <a
                  href=""
                  className="text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver horário de atendimento
                </a>
              </div>
            ))}
          </>
        )
        : <p>Nenhuma loja encontrada.</p>}
    </div>
  );
}
