import { h } from "preact";

export interface AccordeonProps {
  title: string;
  /** @title Texto do Accordeon */
  /** @format html */
  content: string;
}

export interface Props {
  accordeons: AccordeonProps[];
}

const DEFAULT_PROPS: AccordeonProps[] = [
  {
    title: "What is the return policy?",
    content:
      "Our return policy is 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you a refund or exchange.",
  },
  {
    title: "What is the exchange policy?",
    content:
      "Our exchange policy is 30 days. If 30 days have gone by since your purchase, unfortunately we can’t offer you an exchange.",
  },
  {
    title: "How do I return or exchange an item?",
    content:
      "To return or exchange an item, please follow the instructions on our return page.",
  },
  {
    title: "What if I received a damaged item?",
    content: "If you received a damaged item, please contact us immediately.",
  },
];

export function Accordeon(props: Props) {
  const accordeons = props.accordeons.length ? props.accordeons : DEFAULT_PROPS;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="p-8 max-w-screen-xl">
        <div className="flex flex-col">
          {accordeons.map((accordeon, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-white border border-black mb-2 rounded-none"
            >
              <input type="checkbox" id={`accordion-checkbox-${index}`} />
              <label
                htmlFor={`accordion-checkbox-${index}`}
                className="collapse-title text-base font-medium cursor-pointer"
              >
                {accordeon.title}
              </label>
              <div className="collapse-content">
                <p dangerouslySetInnerHTML={{ __html: accordeon.content }}></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Accordeon.defaultProps = {
  accordeons: DEFAULT_PROPS,
};
