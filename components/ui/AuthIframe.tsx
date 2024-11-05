// import { useState } from "preact/hooks";

export interface Props {
  title?: string;
  url: string;
}
interface IDictionary<T> {
  [key: string]: T;
}
const runOnMount = () => {
  window.onload = (e) => {
    const iFrame = document.getElementById(
      "auth-iframe",
    ) as HTMLIFrameElement;

    if (!iFrame) {
      return console.error("Couldn't find iframe");
    }

    // console.log({
    //   x: iFrame!.contentWindow!.document.body.scrollWidth,
    //   y: iFrame!.contentWindow!.document.body.scrollHeight,
    // });

    iFrame.height = iFrame!.contentWindow!.document.body.scrollHeight
      .toString() + "px";

    const d = iFrame!.contentDocument!.documentElement!.getElementsByClassName(
      "vtex-my-account-1-x-menuLink",
    )[0];
    let logout = false;
    if (d) {
      d.addEventListener("click", (e) => {
        logout = true;
        console.log({ e });
      });
    }

    console.log({ d });

    iFrame.onload = (e) => {
      const routes: IDictionary<string> = {
        "Cartões": "/conta/cartoes",
        "Endereços": "/conta/enderecos",
        "Perfil": "/conta/perfil",
        "Pedidos": "/conta/pedidos",
        "Autenticação": "/conta/autenticacao",
        "Login": "/",
      };
      window.location.href = logout ? "/" : (routes[iFrame.title] || "/");
    };

    // console.log({ iframeHeight: iFrame.height });
    // console.log("Foi");
  };
};

function AuthIframe({
  url = "",
  title = "",
}: Props) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(${runOnMount})();` }}>
      </script>
      <div>
        <header class="flex flex-col justify-center items-center gap-4">
          <span class="text-base-100">{title}</span>
        </header>
        <main class="w-full max-w-[80%] sm:max-w-[50%] text-center">
          <iframe
            src={url}
            id="auth-iframe"
            class={`w-[100vw] text-center`}
            frameBorder="0"
            height={700}
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            title={title}
          >
          </iframe>
        </main>
      </div>
    </>
  );
}

export default AuthIframe;
