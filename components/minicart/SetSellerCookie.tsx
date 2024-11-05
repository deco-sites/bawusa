import { useScript } from "deco/hooks/useScript.ts";

export interface Props {
  [key: string]: any;
  active: boolean;
}

export default function SetSellerCookie() {
  //Script dinamicamente com o parâmetro da URL
  const onLoad = () => {
    const url = new URL(window.location.href);
    const coupon = url.searchParams.get("addCoupon");
    if (coupon) {
      //add 30 minutes to the current time
      document.cookie = `sellerCoupon=${coupon} ; expires=${new Date( Date.now() + 1800000).toUTCString() } ; path=/`;
    }
  };

  // Hook para criar e injetar o script
  return (
    <div>
      <script
        type="module"
        dangerouslySetInnerHTML={{ __html: useScript(onLoad) }}
      />
    </div>
  );
}
