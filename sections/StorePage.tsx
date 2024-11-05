import StorePageContainer from "../islands/StorePageContainer.tsx";
import { ImageWidget } from "apps/admin/widgets.ts";
import { Secret } from "apps/website/loaders/secret.ts";

export interface StorePageProps {
  image: {
    desktop: ImageWidget;
    mobile: ImageWidget;
    alt?: string;
  };
  apiKeyMaps: Secret;
}

const StorePage = ({ image, apiKeyMaps }: StorePageProps) => {
  return <StorePageContainer image={image} apiKeyMaps={apiKeyMaps.get()!} />;
};

export default StorePage;
