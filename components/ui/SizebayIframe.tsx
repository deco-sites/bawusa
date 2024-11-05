// import { useState } from "preact/hooks";

export interface Props {
  url: string;
}
interface IDictionary<T> {
  [key: string]: T;
}
const runOnMount = () => {
  const iFrame = document.getElementById(
    "sizebay-iframe",
  ) as HTMLIFrameElement;

  if (!iFrame) {
    return console.error("Couldn't find iframe");
  }
};

function SizebayIframe({
  url = "",
}: Props) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `(${runOnMount})();` }}>
      </script>
      <div>
        <main class="w-full text-center">
          <iframe
            src={url}
            id="sizebay-iframe"
            class={`w-full text-center`}
            frameBorder="0"
            height={550}
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
          >
          </iframe>
        </main>
      </div>
    </>
  );
}

export default SizebayIframe;
