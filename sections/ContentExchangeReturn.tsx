import IconBrandWhatsapp from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/brand-whatsapp.tsx";
import IconMail from "https://deno.land/x/tabler_icons_tsx@0.0.5/tsx/mail.tsx";

export interface Props {
  title: string;
  /** @format html  */
  text: string;
  textSendMessage?: string;
  linkSendMessage?: string;
  textWhatsapp?: string;
  linkWhatsapp?: string;
  /** @format html  */
  textPolicy: string;
}
export default function ContentExchangeReturn(props: Props) {
  return (
    <div className="flex flex-col justify-center items-center bg-zinc-100">
      <div className="p-8 max-w-screen-xl">
        <div className="w-full flex items-center justify-center flex-col">
          <h1 className="text-2xl font-medium">{props.title}</h1>
        </div>
        <div className="flex flex-col justify-center items-center pt-5">
          <p
            className="text-base text-black"
            dangerouslySetInnerHTML={{ __html: props.text }}
          >
          </p>
        </div>
        <div className="flex space-x-4 pt-4">
          <a
            href={props.linkSendMessage}
            className="flex items-center space-x-2 text-black hover:text-gray-700 cursor-pointer"
          >
            <IconMail className="h-6 w-6" />
            <span className="border-b border-black">
              {props.textSendMessage}
            </span>
          </a>
          <a
            href={props.linkWhatsapp}
            className="flex items-center space-x-2 text-black hover:text-gray-700 cursor-pointer"
          >
            <IconBrandWhatsapp className="h-6 w-6" />
            <span className="border-b border-black">{props.textWhatsapp}</span>
          </a>
        </div>
        <div className="flex flex-col justify-center items-start pt-5">
          <p
            className="text-base text-black"
            dangerouslySetInnerHTML={{ __html: props.textPolicy }}
          >
          </p>
        </div>
      </div>
    </div>
  );
}
