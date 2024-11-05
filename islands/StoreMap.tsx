import { h } from "preact";
import { useEffect, useRef } from "preact/compat";
import { Loader } from "https://esm.sh/@googlemaps/js-api-loader@1.16.6";
import { Signal } from "@preact/signals";
import type { BusinessHour, StoreLocation } from "../types/storeLocation.ts";
import IconX from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/x.tsx";

export interface Props {
  apiKey: string;
  mapStoresSignal: Signal<StoreLocation[]>;
  selectedStoreSignal: Signal<StoreLocation | null>;
}

const daysOfWeek = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function formatBusinessHours(businessHours: BusinessHour[]) {
  return businessHours.map((hour) => (
    <div key={hour.dayOfWeek} className="flex justify-between">
      <span>{daysOfWeek[hour.dayOfWeek]}:</span>
      <span>{hour.openingTime} - {hour.closingTime}</span>
    </div>
  ));
}

function formatPhoneNumber(phone: string) {
  const match = phone.match(/^(\d{2})-(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
}

function StoreDetailsCard(
  { store, onClose }: { store: StoreLocation; onClose: () => void },
) {
  return (
    <div className="absolute top-4 left-4 bg-white shadow-lg border p-4 z-10 border-black w-96">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold">{store.name}</h2>
        <button onClick={onClose}>
          <IconX className="w-6 h-6" />
        </button>
      </div>
      <p className="mb-2">
        {store.address.street}, {store.address.number},{" "}
        {store.address.complement ?? ""} - {store.address.neighborhood},{" "}
        {store.address.city} - {store.address.state}, {store.address.postalCode}
      </p>
      <p className="mb-2">
        <strong>Telefone:</strong>{" "}
        {formatPhoneNumber(store.instructions.trim() || "-")}
      </p>
      <h3 className="text-lg font-bold mb-2">Horário de atendimento:</h3>
      <div className="flex flex-col">
        {formatBusinessHours(store.businessHours)}
      </div>
    </div>
  );
}

export default function StoreMap(
  { apiKey, mapStoresSignal, selectedStoreSignal }: Props,
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey,
      version: "weekly",
    });
    const mapStyles = [
      {
        featureType: "administrative",
        elementType: "all",
        stylers: [
          {
            visibility: "on",
          },
          {
            saturation: -100,
          },
          {
            lightness: 20,
          },
        ],
      },
      {
        featureType: "road",
        elementType: "all",
        stylers: [
          {
            visibility: "on",
          },
          {
            saturation: -100,
          },
          {
            lightness: 40,
          },
        ],
      },
      {
        featureType: "water",
        elementType: "all",
        stylers: [
          {
            visibility: "on",
          },
          {
            saturation: -10,
          },
          {
            lightness: 30,
          },
        ],
      },
      {
        featureType: "landscape.man_made",
        elementType: "all",
        stylers: [
          {
            visibility: "simplified",
          },
          {
            saturation: -60,
          },
          {
            lightness: 10,
          },
        ],
      },
      {
        featureType: "landscape.natural",
        elementType: "all",
        stylers: [
          {
            visibility: "simplified",
          },
          {
            saturation: -60,
          },
          {
            lightness: 60,
          },
        ],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
          {
            saturation: -100,
          },
          {
            lightness: 60,
          },
        ],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [
          {
            visibility: "off",
          },
          {
            saturation: -100,
          },
          {
            lightness: 60,
          },
        ],
      },
    ];

    loader.load().then(() => {
      if (mapRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current, {
          center: { lat: -23.1864811, lng: -43.9953885 },
          zoom: 8,
          styles: mapStyles,
        });
      }
    }).catch((e) => {
      console.error(e);
    });
  }, [apiKey]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const bounds = new google.maps.LatLngBounds();

      mapStoresSignal.value.forEach((store) => {
        const position = {
          lat: store.address.geoCoordinates[1],
          lng: store.address.geoCoordinates[0],
        };

        const marker = new google.maps.Marker({
          position,
          map: mapInstanceRef.current,
          title: store.name,
          icon: {
            url: "//bawclothing.vteximg.com.br/arquivos/bmarker.png",
            scaledSize: new google.maps.Size(24, 30),
          },
          animation: google.maps.Animation.BOUNCE,
        });

        markersRef.current.push(marker);

        bounds.extend(position);

        setTimeout(() => {
          marker.setAnimation(null);
        }, 1500);
      });

      mapInstanceRef.current.fitBounds(bounds);
    }
  }, [mapStoresSignal.value]);

  useEffect(() => {
    if (selectedStoreSignal.value && mapInstanceRef.current) {
      const selectedStore = selectedStoreSignal.value;
      const position = new google.maps.LatLng(
        selectedStore.address.geoCoordinates[1],
        selectedStore.address.geoCoordinates[0],
      );
      mapInstanceRef.current.setCenter(position);
      mapInstanceRef.current.setZoom(15);
    }
  }, [selectedStoreSignal.value]);

  return (
    <div class="relative flex-1">
      <div class="w-full h-96 md:h-screen bg-gray-200 rounded-lg">
        <div id="map" class="w-full h-full" ref={mapRef}></div>
        {selectedStoreSignal.value && (
          <StoreDetailsCard
            store={selectedStoreSignal.value}
            onClose={() => selectedStoreSignal.value = null}
          />
        )}
      </div>
    </div>
  );
}
