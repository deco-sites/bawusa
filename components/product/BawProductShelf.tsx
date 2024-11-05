import ProductCard from "$store/islands/ProductCardSimilar.tsx";
import SliderJS from "$store/islands/SliderJS.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import Slider from "$store/components/ui/Slider.tsx";
import { SendEventOnView } from "$store/sdk/analytics.tsx";
import { useId } from "preact/hooks";
import { mapProductToAnalyticsItem } from "apps/commerce/utils/productToAnalyticsItem.ts";
import type { FnContext, LoaderReturnType } from "$live/types.ts";
import { useDevice } from "$store/sdk/useDevice.ts";
import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";
import { mapUserToShopperAnalytics } from "$store/sdk/userToShopperAnalytics.ts";

import type {
  Product,
  ProductGroup,
  ProductLeaf,
  UnitPriceSpecification,
} from "apps/commerce/types.ts";

export interface Props {
  title: string;
  products: LoaderReturnType<Product[] | null>;
  itemsPerPage?: number;
  colorRed: boolean;
}

function ProductShelf(
  { colorRed, title, products, device, shopper }: ReturnType<typeof loader>,
) {
  const id = useId();
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div
      id={id}
      class="grid grid-cols-[48px_1fr_48px] grid-rows-[48px_1fr_48px_1fr] py-10 px-0 sm:pl-8 sm:pr-[75px]"
    >
      <h2 class="text-left row-start-1 col-span-full ml-6 sm:ml-0">
        <span class="font-black text-3xl">{title}</span>
      </h2>

      <Slider class="carousel carousel-center sm:carousel-end gap-6 col-span-full row-start-2 row-end-5">
        {products?.map((product, index) => (
          <Slider.Item
            index={index}
            class="carousel-item w-[280px] sm:w-[280px] first:ml-6 sm:first:ml-0 last:mr-6 sm:last:mr-0"
          >
            <ProductCard
              product={product as Product}
              colorRed={colorRed}
              itemListName={title}
            />
          </Slider.Item>
        ))}
      </Slider>

      <>
        <div class="hidden relative sm:block z-10 col-start-1 row-start-3">
          <Slider.PrevButton class="btn btn-outline absolute right-1/2 bg-base-100 border-none rounded-none">
            <Icon size={20} id="ChevronLeft" strokeWidth={3} />
          </Slider.PrevButton>
        </div>
        <div class="hidden relative sm:block z-10 col-start-3 row-start-3">
          <Slider.NextButton class="btn btn-outline absolute left-1/2 bg-base-100 border-none rounded-none">
            <Icon size={20} id="ChevronRight" strokeWidth={3} />
          </Slider.NextButton>
        </div>
      </>
      <SliderJS rootId={id} />
      <SendEventOnView
        id={id}
        event={{
          name: "view_item_list",
          params: {
            item_list_name: title,
            shopper,
            items: products.map((product) =>
              mapProductToAnalyticsItem({
                product: product as Product,
                ...(product.offers),
                price: product.offers?.offers?.[0]?.price,
                listPrice: product.offers?.offers?.[0]?.priceSpecification.find(
                  (spec) => spec.priceType === "https://schema.org/ListPrice",
                )?.price,
              })
            ),
          },
        }}
      />
    </div>
  );
}

export const loader = (props: Props, req: Request, ctx: FnContext) => {
  const { deviceSignal } = useDevice();
  deviceSignal.value = ctx.device || "desktop";
  const device = deviceSignal.value;

  const { user } = useUser();
  const shopper = user.value?.email
    ? mapUserToShopperAnalytics(user.value)
    : undefined;

  const bestInstallment = (
    acc: UnitPriceSpecification | null,
    curr: UnitPriceSpecification,
  ) => {
    if (curr.priceComponentType !== "https://schema.org/Installment") {
      return acc;
    }

    if (!acc) {
      return curr;
    }

    if (acc.price > curr.price) {
      return curr;
    }

    if (acc.price < curr.price) {
      return acc;
    }

    if (
      acc.billingDuration && curr.billingDuration &&
      acc.billingDuration < curr.billingDuration
    ) {
      return curr;
    }

    return acc;
  };

  const installment = (specs: UnitPriceSpecification[]) =>
    specs.reduce(bestInstallment, null);

  const isVariantOfMap = (isVariantOf: Product["isVariantOf"]) => {
    const hasVariant = isVariantOf?.hasVariant?.filter(
      (variant) =>
        variant.offers?.offers.some((offer) =>
          offer.availability === "https://schema.org/InStock"
        ),
    ).map((variant: ProductLeaf) => {
      const { offers, url, productID, additionalProperty } = variant;
      return {
        offers: {
          ...offers,
          offers: offers?.offers.filter((offer) => offer.seller === "1").map(
            (offer) => {
              const best = installment(offer.priceSpecification);
              const specs = offer.priceSpecification.filter((spec) =>
                ["https://schema.org/ListPrice"].includes(spec.priceType)
              );

              if (best) {
                specs.push(best);
              }
              return ({
                seller: offer.seller,
                priceSpecification: specs.map((spec) => {
                  return {
                    ...spec,
                    price: spec.price,
                    priceComponentType: spec.priceComponentType,
                    priceType: spec.priceType,
                    billingIncrement: spec.billingIncrement,
                    billingDuration: spec.billingDuration,
                  };
                }),
                price: offer.price,
                availability: offer.availability,
                inventoryLevel: offer.inventoryLevel,
              });
            },
          ),
        },
        url,
        productID,
        additionalProperty: additionalProperty?.filter((property) =>
          property.valueReference === "SPECIFICATION"
        ),
      };
    });
    return {
      productGroupID: isVariantOf?.productGroupID,
      name: isVariantOf?.name,
      hasVariant,
    };
  };

  const products = props.products?.map((product) => {
    const isVariantOf = {
      productGroupID: product.isVariantOf?.productGroupID,
      name: product.isVariantOf?.name,
      hasVariant: ctx.device === "desktop"
        ? product.isVariantOf?.hasVariant
        : undefined,
    };

    const offers = (product.isVariantOf?.hasVariant.flatMap((variant) =>
      variant.offers?.offers ?? []
    ) ?? []).filter((offer) =>
      offer.availability === "https://schema.org/InStock"
    );

    const traditionalOffer = offers.find((offer) =>
      offer.seller === "1"
    );
    const onDemandOffer = offers.find((offer) => offer.seller === "DMD");
    const olympikusOffer = offers.find((offer) => offer.seller === "OLY");
    const pacificOffer = offers.find((offer) => offer.seller === "pacific");

    const sellerOffer =
      [onDemandOffer || olympikusOffer || pacificOffer || traditionalOffer] ||
      [] as UnitPriceSpecification[];

    return {
      productID: product.productID,
      inProductGroupWithID: product.inProductGroupWithID,
      isVariantOf: isVariantOfMap(isVariantOf as Product["isVariantOf"]),
      isSimilarTo: product.isSimilarTo?.map((similar) => {
        const { image, offers, productID, url } = similar;
        const isVariantOf = isVariantOfMap(similar.isVariantOf!);
        const colorImage = image?.find((img) =>
          img?.alternateName === "color-thumbnail"
        );
        return {
          image: [image?.[0], image?.[1], colorImage],
          offers: {
            ...offers,
            offers: sellerOffer.map(
              (offer) => {
                const best = installment(offer!.priceSpecification);
                const specs = offer!.priceSpecification.filter((spec) =>
                  ["https://schema.org/ListPrice"].includes(spec.priceType)
                );

                if (best) {
                  specs.push(best);
                }
                return ({
                  seller: offer!.seller,
                  priceSpecification: specs.map((spec) => {
                    return {
                      ...spec,
                      price: spec.price,
                      priceComponentType: spec.priceComponentType,
                      priceType: spec.priceType,
                      billingIncrement: spec.billingIncrement,
                      billingDuration: spec.billingDuration,
                    };
                  }),
                  price: offer!.price,
                  availability: offer!.availability,
                  inventoryLevel: offer!.inventoryLevel,
                });
              },
            ),
          },
          productID,
          url,
          isVariantOf,
        };
      }),
      url: product.url,
      offers: {
        ...product.offers,
        offers: sellerOffer
          .map((offer) => {
            const best = installment(offer!.priceSpecification);
            const specs = offer!.priceSpecification.filter((spec) =>
              ["https://schema.org/ListPrice"].includes(spec.priceType)
            );
            if (best) {
              specs.push(best);
            }
            return ({
              seller: offer!.seller,
              priceSpecification: specs.map((spec) => {
                return {
                  ...spec,
                  price: spec.price,
                  priceComponentType: spec.priceComponentType,
                  priceType: spec.priceType,
                  billingIncrement: spec.billingIncrement,
                  billingDuration: spec.billingDuration,
                };
              }),
              price: offer!.price,
              availability: offer!.availability,
              inventoryLevel: offer!.inventoryLevel,
            });
          }),
      },
      image: [product.image?.[0], product.image?.[1]],
      category: product.category,
      sku: product.sku,
      name: product.name,
    };
  });

  // const size = new TextEncoder().encode(JSON.stringify(products)).length
  // const kiloBytes = size / 1024;
  // const megaBytes = kiloBytes / 1024;

  // console.log({ size, kiloBytes, megaBytes })

  return { ...props, products, device, shopper };
};

export default ProductShelf;
