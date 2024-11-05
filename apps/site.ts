import { App, AppContext as AC } from "$live/mod.ts";
import std, { Props } from "apps/compat/std/mod.ts";
import manifest, { Manifest } from "../manifest.gen.ts";
import commerce from "apps/commerce/mod.ts";

type StdApp = ReturnType<typeof std>;
type CommerceApp = ReturnType<typeof commerce>;

/**
 * @title Site
 * @description Start your site from a template or from scratch.
 * @category Tool
 * @logo https://ozksgdmyrqcxcwhnbepg.supabase.co/storage/v1/object/public/assets/1/0ac02239-61e6-4289-8a36-e78c0975bcc8
 */
export default function Site(
  state: Props,
): App<Manifest, Props, [
  StdApp,
  CommerceApp
]> {
  const stdApp = std(state);
  const commerceApp = commerce(state)
  return {
    state: {
      ...state,
      ...stdApp.state,
    },
    manifest,
    dependencies: [
      stdApp,
      commerceApp
    ],
  };
}

export type Storefront = ReturnType<typeof Site>;
export type AppContext = AC<Storefront>;
export { onBeforeResolveProps } from "apps/compat/$live/mod.ts";
