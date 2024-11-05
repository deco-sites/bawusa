import { Head } from "$fresh/runtime.ts";
import ScriptLDJson from "deco-sites/std/components/seo/ScriptLDJson.tsx";
import Preview from "deco-sites/std/components/seo/components/Preview.tsx";
import type { Props } from "deco-sites/std/components/seo/types.ts";
import type {
  BreadcrumbList,
  ProductDetailsPage,
  ProductListingPage,
} from "apps/commerce/types.ts";

const handleSEO = (
  props: Omit<Props, "context"> & {
    context: ProductDetailsPage | ProductListingPage | null;
  },
  ctx:
    | ReturnType<typeof tagsFromProduct>
    | ReturnType<typeof tagsFromListing>,
) => ({
  title: ctx?.title || props.title,
  image: ctx?.imageUrl || props.image,
  canonical: ctx?.canonical || props.canonical,
  description: (ctx?.description || props.description)?.replace(
    /(<([^>]+)>)/gi,
    "",
  ),
});

const canonicalFromBreadcrumblist = (
  { itemListElement }: BreadcrumbList,
) =>
  itemListElement.length > 0
    ? itemListElement.reduce((acc, curr) =>
      acc.position < curr.position ? curr : acc
    ).item
    : undefined;

function tagsFromProduct(
  page: ProductDetailsPage | null,
  template: string,
) {
  if (!page) return null;

  const { product, breadcrumbList: breadcrumb, seo } = page;

  const title = template?.replace("%s", seo?.title || "") ||
    seo?.title;
  const description = seo?.description;
  const canonical = seo?.canonical ||
    (breadcrumb && canonicalFromBreadcrumblist(breadcrumb));
  const imageUrl = product?.image?.[0]?.url;

  return { title, description, canonical, imageUrl };
}

function tagsFromListing(
  page: ProductListingPage | null,
  titleTemplate: string,
  descriptionTemplate: string,
) {
  if (!page) return null;

  const { seo, breadcrumb } = page;
  const title = seo?.title && titleTemplate
    ? titleTemplate.replace("%s", seo.title || "")
    : seo?.title;
  const description = seo?.description && descriptionTemplate
    ? descriptionTemplate.replace("%s", seo.description || "")
    : seo?.description;
  const canonical = seo?.canonical ||
    (breadcrumb && canonicalFromBreadcrumblist(breadcrumb));

  return { title, description, canonical, imageUrl: "" };
}

function Metatags(
  props: Omit<Props, "context"> & {
    context: ProductDetailsPage | ProductListingPage | null;
  },
) {
  const {
    titleTemplate = "",
    descriptionTemplate = "",
    context,
    type,
    themeColor,
    favicon,
  } = props;
  let { canonical, image } = props;
  const twitterCard = type === "website" ? "summary" : "summary_large_image";

  const tags = context?.["@type"] === "ProductDetailsPage"
    ? tagsFromProduct(context, titleTemplate)
    : context?.["@type"] === "ProductListingPage"
    ? tagsFromListing(context, titleTemplate, descriptionTemplate)
    : null;

  const SEO = handleSEO(props, tags);
  const { title, description } = SEO;
  if (!canonical) {
    canonical = SEO.canonical;
  }

  if (!image) {
    image = SEO.image;
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content={themeColor} />
        <link rel="icon" href={favicon} />

        {/* Twitter tags */}
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={image} />
        <meta property="twitter:card" content={twitterCard} />
        {/* OpenGraph tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content={type} />
        <meta property="og:image" content={image} />

        {/* Link tags */}
        {canonical && <link rel="canonical" href={canonical.toLowerCase()} />}

        {/* No index, no follow */}
        {props?.noIndexNoFollow && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </Head>
      {context?.["@type"] === "ProductDetailsPage" && (
        <>
          <ScriptLDJson {...{ ...context.product, isVariantOf: [] }} />
          <ScriptLDJson {...context.breadcrumbList} />
        </>
      )}
      {context?.["@type"] === "ProductListingPage" && (
        <ScriptLDJson {...context.breadcrumb} />
      )}
    </>
  );
}

export { Preview };

export default Metatags;
