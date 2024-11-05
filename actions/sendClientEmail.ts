import { fetchAPI } from "deco-sites/std/utils/fetch.ts";
import type { Context } from "deco-sites/std/packs/vtex/accounts/vtex.ts";
import { parseCookie } from "deco-sites/std/packs/vtex/utils/vtexId.ts";
import { OrderForm } from "deco-sites/std/packs/vtex/types.ts";

export interface PropsCreate {
  email: string;
  orderFormId: string;
}

const parseCookies = (str: string): { [key: string]: string } => {
  return str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      const [key, value] = v.map(decodeURIComponent);
      acc[key.trim()] = value.trim();
      return acc;
    }, {} as { [key: string]: string });
};

export const sendClientEmail = async (
  props: PropsCreate,
  req: Request,
  ctx: Context,
): Promise<OrderForm | null> => {
  const { orderFormId, email } = props;
  const url =
    `https://bawclothing.deco.site/api/checkout/pub/orderForm/${orderFormId}/attachments/clientProfileData`;
  const { configVTEX: config } = ctx;
  const { cookie } = parseCookie(req.headers, config!.account);

  try {
    const response = await fetchAPI<OrderForm>(
      url,
      {
        method: "POST",
        body: JSON.stringify(
          {
            "email": email,
            "expectedOrderFormSections": [
              "items",
              "totalizers",
              "clientProfileData",
              "shippingData",
              "paymentData",
              "sellers",
              "messages",
              "marketingData",
              "clientPreferencesData",
              "storePreferencesData",
              "giftRegistryData",
              "ratesAndBenefitsData",
              "openTextField",
              "commercialConditionData",
              "customData",
            ],
          },
        ),
        headers: {
          "content-type": "application/json",
          accept: "application/json",
          cookie,
          "VtexIdclientAutCookie":
            parseCookies(cookie).VtexIdclientAutCookie_bawclothing,
        },
      },
    );

    return response;
  } catch (e) {
    // console.log({ e });
    return e;
  }
};

export default sendClientEmail;
