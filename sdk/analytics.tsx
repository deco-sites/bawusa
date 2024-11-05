import { IS_BROWSER } from "$fresh/runtime.ts";
import type {
  AddShippingInfoEvent,
  AddToCartEvent,
  AddToWishlistEvent,
  AnalyticsItem,
  BeginCheckoutEvent,
  DecoEvent,
  IEvent,
  LoginEvent,
  RemoveFromCartEvent,
  SearchEvent,
  SelectItemEvent,
  SelectPromotionEvent,
  ViewCartEvent,
  ViewItemEvent,
  ViewItemListEvent,
  ViewPromotionEvent,
} from "apps/commerce/types.ts";
import { scriptAsDataURI } from "apps/utils/dataURI.ts";

/** @docs https://developers.google.com/analytics/devguides/collection/ga4/reference/events?client_type=gtm#view_item_list */
export interface ViewCategoryEvent extends IEvent<ViewCategoryParams> {
  name: "view_category";
}

export interface ViewCategoryParams {
  category_id?: string;
  category_name?: string;
  items: AnalyticsItem[];
}

type AnalyticsEvent =
  | AddShippingInfoEvent
  | AddToCartEvent
  | AddToWishlistEvent
  | BeginCheckoutEvent
  | LoginEvent
  | RemoveFromCartEvent
  | SearchEvent
  | SelectItemEvent
  | SelectPromotionEvent
  | ViewCartEvent
  | ViewItemEvent
  | ViewItemListEvent
  | ViewPromotionEvent
  | DecoEvent
  | ViewCategoryEvent;

export const sendEvent = <E extends AnalyticsEvent>(event: E) =>
  window.DECO?.events?.dispatch(event);

/**
 * This function is usefull for sending events on click. Works with both Server and Islands components
 */
export const sendEventOnClick = <E extends AnalyticsEvent>(event: E) => ({
  onclick: IS_BROWSER
    ? () => sendEvent(event)
    : () => `(${sendEvent})(${JSON.stringify(event)})`,
});

/**
 * This componente should be used when want to send event for rendered componentes.
 * This behavior is usefull for view_* events.
 */
export const SendEventOnLoad = <E extends AnalyticsEvent>(
  { event }: { event: E },
) => (
  <script
    dangerouslySetInnerHTML={{
      __html: `addEventListener("load", () => (${sendEvent})(${
        JSON.stringify(event)
      }))`,
    }}
  />
);

export const SendEventOnView = <E extends AnalyticsEvent>(
  { event, id }: { event: E; id: string },
) => (
  <script
    defer
    src={scriptAsDataURI(
      (id: string, event: E) => {
        const elem = document.getElementById(id);

        if (!elem) {
          return console.warn(
            `Could not find element ${id}. Click event will not be send. This will cause loss in analytics`,
          );
        }

        const observer = new IntersectionObserver((items) => {
          for (const item of items) {
            if (!item.isIntersecting) continue;

            window.DECO_SITES_STD.sendAnalyticsEvent(event);
            observer.unobserve(elem);
          }
        });

        observer.observe(elem);
      },
      id,
      event,
    )}
  />
);
