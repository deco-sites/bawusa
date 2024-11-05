import Icon, { AvailableIcons } from "$store/components/ui/Icon.tsx";
import Newsletter from "$store/islands/Newsletter.tsx";
import type { ComponentChildren } from "preact";
import type { Image as LiveImage } from "deco-sites/std/components/types.ts";
import Image from "apps/website/components/Image.tsx";

export type IconItem = { icon: AvailableIcons; href: string };
export type StringItem = {
  label: string;
  href?: string;
  /** @default blank */
  target?: "blank" | "self";
};
export type StringNewsletter = {
  Title: string;
  desc?: string;
  successText: string;
  errorText: string;
};

export type Item = StringItem | IconItem;

export type Section = {
  label: string;
  children: Item[];
};

const isIcon = (item: Item): item is IconItem =>
  // deno-lint-ignore no-explicit-any
  typeof (item as any)?.icon === "string";

function SectionItem({ item }: { item: Item }) {
  return (
    <span class="text-white text-[14px]">
      {isIcon(item)
        ? (
          <div class="border-white border border-solid py-1.5 px-2.5">
            <Icon
              id={item.icon}
              width={25}
              height={20}
              strokeWidth={0.01}
            />
          </div>
        )
        : (
          item.href
            ? (
              <a
                href={item.href}
                target={item.target ? `_${item.target}` : "_blank"}
              >
                {item.label}
              </a>
            )
            : <span>{item.label}</span>
        )}
    </span>
  );
}

function FooterContainer(
  { children, class: _class = "" }: {
    class?: string;
    children: ComponentChildren;
  },
) {
  return <div class={`py-6 px-4 sm:py-12 sm:px-0 ${_class}`}>{children}</div>;
}

export interface Props {
  Service: string;
  Phone_Number: string;
  Href_Instagram: string;
  Href_Facebook: string;
  Href_Twitter: string;
  sections?: Section[];
  titleNewsletter: string;
  descNewsletter: string;
  successTextNewsletter: string;
  errorTextNewsletter: string;
  imgFooter: LiveImage;
}

function Footer(
  {
    sections = [],
    Service,
    Phone_Number,
    Href_Instagram,
    Href_Facebook,
    Href_Twitter,
    titleNewsletter,
    descNewsletter,
    successTextNewsletter,
    errorTextNewsletter,
    imgFooter,
  }: Props,
) {
  return (
    <>
      <footer class="relative w-full sm:bg-primary-dark flex flex-col divide-y divide-primary-content sm:pb-[80px] sm:px-8 bg-[#000]">
        <Image
          src={imgFooter}
          width={1440}
          height={400}
          loading={"lazy"}
          class="absolute"
        />
        <div class=" w-full flex flex-col divide-y divide-primary-content border-b border-[#9a9a9a79] z-10">
          <FooterContainer>
            <div class="flex sm:hidden mb-4">
              <Newsletter
                Title={titleNewsletter}
                desc={descNewsletter}
                successText={successTextNewsletter}
                errorText={errorTextNewsletter}
              />
            </div>
            {/* Desktop view */}
            <div class="flex flex-col lg:flex-row justify-start gap-8 lg:justify-between">
              <ul class="flex flex-col lg:flex-row justify-start gap-16 lg:justify-between">
                {sections.map((section) => (
                  <li class="min-w-[200px]">
                    <span class="text-[14px] text-[#9a9a9a]">
                      {section.label}
                    </span>

                    <ul
                      class={`flex ${
                        isIcon(section.children[0]) ? "flex-row" : "flex-col"
                      } gap-2 pt-2 flex-wrap`}
                    >
                      {section.children.map((item) => (
                        <li>
                          <SectionItem item={item} />
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}

                <li>
                  <span class="text-[14px] text-[#9a9a9a]">
                    Fale Conosco
                  </span>
                  <ul class="flex flex-col gap-2 pt-2 flex-wrap">
                    <li>
                      <SectionItem item={{ label: "SAC " + Phone_Number }} />
                    </li>
                    <li>
                      <SectionItem
                        item={{ label: "Horários de Atendimento" }}
                      />
                    </li>
                    <li>
                      <SectionItem item={{ label: Service }} />
                    </li>
                    <li>
                      <div class="flex flex-row object-center justify-start text-end gap-5">
                        <a
                          href={Href_Facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="F Facebook"
                        >
                          <Icon
                            class="text-white"
                            width={25}
                            height={25}
                            id="F Facebook"
                            strokeWidth={0}
                          />
                        </a>

                        <a
                          href={Href_Twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter Logo"
                        >
                          <Icon
                            class="text-white"
                            width={25}
                            height={25}
                            id="TwitterLogo"
                            strokeWidth={1}
                          />
                        </a>
                        <a
                          href={Href_Instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram logo"
                        >
                          <Icon
                            class="text-white pb-1"
                            width={32}
                            height={32}
                            id="Instagram"
                            strokeWidth={2}
                          />
                        </a>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
              <div class="hidden sm:flex">
                <Newsletter
                  Title={titleNewsletter}
                  desc={descNewsletter}
                  successText={successTextNewsletter}
                  errorText={errorTextNewsletter}
                />
              </div>
            </div>
          </FooterContainer>
        </div>
      </footer>

      <div class="w-full bg-white">
        <div class="container w-full">
          <FooterContainer class="flex justify-between w-full">
            <div class="">
              <div>
                <span class="text-xs">
                  © Baw Clothing - Todos os direitos reservado - BAW Clothing
                  Indústria e Comércio de Vestuários Ltda. CNPJ
                  27.238.862/0001-03 SAC (11) 3181-6118
                </span>
              </div>
              <div class="mt-2">
                <span class="flex items-center gap-1 text-[#747474] text-xs">
                  Powered by{" "}
                  <a
                    href="https://www.deco.cx"
                    aria-label="powered by https://www.deco.cx"
                  >
                    <Icon id="Deco" height={15} width={45} strokeWidth={0.01} />
                  </a>
                </span>
              </div>
            </div>

            <div class="flex">
              <Image
                height={200}
                width={200}
                loading={"lazy"}
                src={"https://bawclothing.vtexassets.com/assets/vtex.file-manager-graphql/images/cb2b8e5a-8783-4090-a3b9-aecc33ce8c42___206c3b8b0da92d76e40c362f80f2cf6a.svg"}
                alt="credit cards"
              />
            </div>
          </FooterContainer>
        </div>
      </div>
    </>
  );
}

export default Footer;
