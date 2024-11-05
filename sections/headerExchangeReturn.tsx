import { Picture, Source } from "apps/website/components/Picture.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";

export interface Props {
  title: string;
  subtitle?: string;
  image: {
    /** @description desktop otimized image */
    desktop: ImageWidget;
    /** @description mobile otimized image */
    mobile: ImageWidget;
    /** @description Image's alt text */
    alt?: string;
  };
  textButton: string;
  linkButton: string;
}
export default function HeaderExchangeReturn(props: Props) {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="p-8 max-w-screen-xl">
        <div className="w-full flex items-center justify-center flex-col">
          <h1 className="font-bold text-3xl mb-5 text-center">{props.title}</h1>
          <p className="text-base text-center text-gray-500 mb-10">
            {props.subtitle}
          </p>
        </div>
        <div className="flex flex-col justify-center items-center pt-5">
          <Picture className="mb-5">
            <Source
              media="(max-width: 767px)"
              src={props.image.mobile}
              width={356}
              height={123}
              alt={props.image.alt}
            />
            <Source
              media="(min-width: 768px)"
              src={props.image.desktop}
              width={840}
              height={250}
              alt={props.image.alt}
            />
            <img
              src={props.image.desktop}
              alt={props.image.alt}
              width={840}
              height={250}
            />
          </Picture>
          <a
            href={props.linkButton}
            className="bg-purple-500 text-white py-4 px-6 rounded-lg text-base cursor-pointer"
          >
            {props.textButton}
          </a>
        </div>
      </div>
    </div>
  );
}
