import { Accordeon, AccordeonProps } from "../components/ui/Accordeon.tsx";

export interface Props {
  title: string;
  /** @title Item do Accordeon */
  accordeons: AccordeonProps[];
}

export default function FaqExchangeReturn(props: Props) {
  return (
    <div class="flex flex-col justify-center items-center">
      <div className="p-8 max-w-screen-xl">
        <div className="w-full flex items-center justify-center flex-col pb-5">
          <h1 className="text-3xl font-bold">{props.title}</h1>
        </div>

        <div className="flex">
          <Accordeon accordeons={props.accordeons} />
        </div>
      </div>
    </div>
  );
}
