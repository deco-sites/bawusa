import type { OrderForm } from "deco-sites/std/packs/vtex/types.ts";

export interface Props {
  oldOrderForm: OrderForm | null;
  coupon: string;
  typeField?: "coupon" | "seller";
}

async function putCouponInOrderForm(
  { coupon, typeField, oldOrderForm }: Props,
) {
  if (oldOrderForm) {
    const response = await fetch(
      `https://bawclothing.myvtex.com/_v/addCoupon/${oldOrderForm.orderFormId}/${coupon}`,
      {
        method: "PUT",
        headers: {
          "accept": "application/json",
          "content-type": "application/json",
        },
      },
    );

    const { data } = await response.json();

    if (data.success) {
      const response = await fetch(
        `https://bawclothing.vtexcommercestable.com.br/api/checkout/pub/orderForm/${oldOrderForm.orderFormId}`,
        {
          method: "GET",
          headers: {
            "accept": "application/json",
          },
        },
      );

      const data = await response.json();

      let infoMessage = "";

      if (
        typeField === "coupon" &&
        (coupon === data.marketingData.utmiCampaign ||
          coupon === data.marketingData.utmCampaign)
      ) {
        infoMessage = "Cupom de vendedor atualizado!";
      }

      if (oldOrderForm.marketingData) {
        const beforeCoupon = oldOrderForm.marketingData.coupon;
        if (
          typeField === "seller" &&
          (beforeCoupon !== coupon) &&
          coupon === data.marketingData.coupon
        ) {
          infoMessage =
            "Atualizamos o seu cupom: removemos o cupom anterior para aplicar um com melhores condições!";
        }
      }
      return { infoMessage, hasError: false, data };
    }

    return { hasError: true, data: data.message };
  }
}

export default putCouponInOrderForm;
