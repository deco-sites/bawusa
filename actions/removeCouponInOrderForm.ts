export interface Props {
  orderFormId: string;
  coupon: string;
}

async function removeCouponInOrderForm({ orderFormId, coupon }: Props) {
  return await fetch(
    `https://bawclothing.myvtex.com/_v/removeCoupon/${orderFormId}/${coupon}`,
    {
      method: "PUT",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    },
  )
    .then(async () => {
      return await fetch(
        `https://bawclothing.vtexcommercestable.com.br/api/checkout/pub/orderForm/${orderFormId}`,
        {
          method: "GET",
          headers: {
            "accept": "application/json",
            "content-type": "application/json",
          },
        },
      );
    })
    .then((response) => response.json());
}

export default removeCouponInOrderForm;
