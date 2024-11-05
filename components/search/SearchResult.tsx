import BawFilters from "$store/components/search/BawFilters.tsx";
import Icon from "$store/components/ui/Icon.tsx";
import SearchControls from "$store/islands/SearchControls.tsx";
import { useId } from "preact/hooks";
import { SendEventOnView } from "$store/sdk/analytics.tsx";
import {
  mapProductToAnalyticsItem,
} from "apps/commerce/utils/productToAnalyticsItem.ts";
import {
  mapCategoriesToAnalyticsCategories,
} from "$store/sdk/productCategoryAnalytics.ts";
import { useOffer } from "$store/sdk/useOffer.ts";
import ProductGallery from "$store/islands/ProductGallery.tsx";
import type { LoaderReturnType } from "$live/types.ts";
import type { ProductListingPage } from "apps/commerce/types.ts";
import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";
import type {
  Product,
  ProductGroup,
  ProductLeaf,
  UnitPriceSpecification,
} from "apps/commerce/types.ts";
import { mapUserToShopperAnalytics } from "$store/sdk/userToShopperAnalytics.ts";

export interface Props {
  page: LoaderReturnType<ProductListingPage | null>;
  /**
   * @description Use drawer for mobile like behavior on desktop. Aside for rendering the filters alongside the products
   */
  variant?: "aside" | "drawer";
  colorRed?: boolean;
}

function NotFound() {
  return (
    <div class="w-full flex flex-col justify-center items-center">
      <div class="w-full flex flex-col sm:flex-row justify-center items-center h-full pb-[30px] sm:pb-[60px] my-[110px] ">
        <div class="flex flex-col justify-center text-center w-full sm:w-[600px] ">
          <span class="text-[8rem] sm:text-[10.5rem] text-[#ccc] font-extrabold ">
            Oops!
          </span>
          <span class="sm:mt-[-60px] text-[20px] sm:text-[30px] text-black font-extrabold">
            Nenhum produto foi encontrado
          </span>
        </div>
        <div class="flex flex-col justify-center min-h-[230px] w-[90vw] sm:w-[600px] pl-[15px] sm:pl-[50px] mt-10 border-l-2 rounded-sm border-black bg-white shadow ">
          <h1 class="text-[25px] sm:text-[30px] font-bold text-black">
            O que eu faço?
          </h1>
          <ul class="gap-3 sm:gap-8  text-black ">
            <li class="flex flex-row justify-start items-center text-sm sm:text-xl font-medium  text-[#868686]">
              <div class="bg-[#eee] flex justify-center rounded-full mr-1 sm:mr-4 p-[3px]">
                <Icon
                  class="text-black "
                  width={12}
                  height={12}
                  id=">"
                  strokeWidth={3}
                />
              </div>
              Verifique os termos digitados.
            </li>
            <li class="flex flex-row justify-start items-center text-sm sm:text-xl  font-medium  text-[#868686]">
              <div class="bg-[#eee] flex justify-center rounded-full mr-1 sm:mr-4 p-[3px] ">
                <Icon
                  class="text-black "
                  width={12}
                  height={12}
                  id=">"
                  strokeWidth={3}
                />
              </div>Tente utilizar uma única palavra.
            </li>
            <li class="flex flex-row justify-start items-center text-sm  sm:text-xl font-medium  text-[#868686]">
              <div class="bg-[#eee] flex justify-center rounded-full mr-1 sm:mr-4 p-[3px] ">
                <Icon
                  class="text-black "
                  width={12}
                  height={12}
                  id=">"
                  strokeWidth={3}
                />
              </div>Utilize termos genéricos na busca.
            </li>
            <li class="flex flex-row justify-start items-center text-sm sm:text-xl  font-medium  text-[#868686]">
              <div class="bg-[#eee] flex justify-center rounded-full mr-1 sm:mr-4 p-[3px]">
                <Icon
                  class="text-black "
                  width={12}
                  height={12}
                  id=">"
                  strokeWidth={3}
                />
              </div>Procure utilizar sinônimos ao termo desejado.
            </li>
          </ul>
        </div>
      </div>
      <span
        class={"hidden w-full  justify-center items-center text-center sm:flex text-[3rem]  text-[#3a3a3a] font-extrabold"}
      >
        Eita, alguma coisa se perdeu por aqui.. talvez esses produtos te ajudem?
      </span>
    </div>
  );
}

function Result(
  { page, variant, colorRed }: Omit<Props, "page"> & {
    page: ProductListingPage;
  },
) {
  const { products, filters, breadcrumb, pageInfo, sortOptions } = page;
  const categories = mapCategoriesToAnalyticsCategories(
    breadcrumb?.itemListElement.map(({ name: _name }) => _name ?? "")
      .filter(Boolean) ??
      [],
  );

  const id = useId();
  const { user } = useUser();
  const shopper = user.value?.email
    ? mapUserToShopperAnalytics(user.value)
    : undefined;

  return (
    <>
      <div class="px-4 sm:py-10 sm:pr-14 w-full">
        <div class="flex flex-row">
          {variant === "aside" && filters.length > 0 && (
            <aside class="hidden sm:block w-min min-w-[250px] mt-5">
              <BawFilters filters={filters} />
            </aside>
          )}

          {filters.length > 0 && (
            <aside class="hidden sm:block w-min min-w-[250px]">
              <BawFilters filters={filters} />
            </aside>
          )}
          <div class="flex-grow sm:pt-10 w-full">
            <div class="flex flex-row w-full sm:justify-between pb-10">
              <div class="flex flex-row w-full justify-between items-center sm:mr-10 sm:gap-5">
                <span class="sm:pl-5 min-w-[80px] font-bold text-base flex flex-row">
                  {pageInfo.records} produtos
                </span>
              </div>

              <SearchControls
                sortOptions={sortOptions}
                filters={filters}
                breadcrumb={breadcrumb}
                displayFilter={variant === "drawer"}
              />
            </div>
            <div id={id}>
              <ProductGallery products={products} colorRed={colorRed} />
            </div>
          </div>
        </div>

        <div class="flex justify-center my-4">
          <div class="btn-group">
            <a
              aria-label="previous page link"
              rel="prev"
              href={pageInfo.previousPage ?? "#"}
              class="btn btn-ghost"
            >
              <Icon id="ChevronLeft" width={20} height={20} strokeWidth={2} />
            </a>
            <span class="btn btn-ghost">
              Página {pageInfo.currentPage}
            </span>
            {pageInfo.nextPage && (
              <a
                aria-label="next page link"
                rel="next"
                href={pageInfo.nextPage ?? "#"}
                class="btn btn-ghost"
              >
                <Icon
                  id="ChevronRight"
                  width={20}
                  height={20}
                  strokeWidth={2}
                />
              </a>
            )}
          </div>
        </div>
      </div>
      {categories.category_name && (
        <SendEventOnView
          id={id}
          event={{
            name: "view_category",
            params: {
              shopper,
              items: page.products?.map((product) =>
                mapProductToAnalyticsItem({
                  ...(useOffer(product.offers)),
                  product,
                  breadcrumbList: page.breadcrumb,
                })
              ),
              ...categories,
            },
          }}
        />
      )}
      <SendEventOnView
        id={id}
        event={{
          name: "view_item_list",
          params: {
            item_list_name: breadcrumb.itemListElement?.at(-1)?.name,
            item_list_id: breadcrumb.itemListElement?.at(-1)?.item,
            shopper,
            items: page.products?.map((product) =>
              mapProductToAnalyticsItem({
                ...(useOffer(product.offers)),
                product,
                breadcrumbList: page.breadcrumb,
              })
            ),
            ...categories,
          },
        }}
      />
    </>
  );
}

function SearchResult(
  { page, ...props }: Props,
) {
  if (!page?.pageInfo?.records || page?.pageInfo.records === 0) {
    return <NotFound />;
  }
  return <Result {...props} page={page!} />;
}

export const loader = (props: Props) => {
  const { page } = props;
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

  const isVariantOfMap = (isVariantOf: ProductGroup) => {
    const hasVariant = isVariantOf.hasVariant.filter((variant) =>
      variant.offers?.offers.some((offer) =>
        offer.availability === "https://schema.org/InStock"
      )
    ).map((variant: ProductLeaf) => {
      const { offers, url, productID, additionalProperty } = variant;
      const traditionalOffer = offers?.offers.filter((offer) =>
        offer.seller === "1"
      );
      const onDemandOffer = offers?.offers.filter((offer) =>
        offer.seller === "DMD"
      );
      const sellerOffer =
        (onDemandOffer?.length ? onDemandOffer : traditionalOffer) || [];
      return {
        offers: {
          ...offers,
          offers: sellerOffer.map(
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
      productGroupID: isVariantOf.productGroupID,
      name: isVariantOf.name,
      hasVariant,
    };
  };

  const products = page
    ? props.page!.products?.map((product) => {
      const offers = product.isVariantOf?.hasVariant.flatMap((variant) =>
        variant.offers?.offers ?? []
      ).filter((offer) => offer.availability === "https://schema.org/InStock");

      const traditionalOffer = offers?.find((offer) => offer.seller === "1");
      const onDemandOffer = offers?.find((offer) => offer.seller === "DMD");

      const olympikusOffer = offers?.find((offer) => offer.seller === "OLY");

      const pacificOffer = offers?.find((offer) => offer.seller === "pacific");

      const sellerOffer = ([
        onDemandOffer || olympikusOffer || pacificOffer || traditionalOffer,
      ] ||
        [] as UnitPriceSpecification[]).filter(Boolean);
      return {
        productID: product.productID,
        inProductGroupWithID: product.inProductGroupWithID,
        isVariantOf: isVariantOfMap(product.isVariantOf!),
        isSimilarTo: product.isSimilarTo?.map((similar) => {
          const { image, offers, productID, url } = similar;
          const isVariantOf = isVariantOfMap(similar.isVariantOf!);
          return {
            image,
            offers: {
              ...offers,
              offers: sellerOffer
                .map(
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
        image: product.image,
        category: product.category,
        name: product.name,
      };
    })
    : [];

  return { ...props, page: { ...props.page, products } };
};

export default SearchResult;
