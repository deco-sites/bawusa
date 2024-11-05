import SearchResult, {
  Props as SearchResultProps,
} from "$store/components/search/SearchResult.tsx";

export type Props = SearchResultProps;

function WishlistGallery(props: Props) {
  const isEmpty = !props.page || props.page.products.length === 0;

  if (isEmpty) {
    return (
      <div class="container mx-4 sm:mx-auto">
        <div class="mx-10 my-20 flex flex-col gap-4 justify-center items-center">
          <span class="font-medium text-2xl">
            Sua wishlist esta vazia
          </span>
          <span>
            Faça login e adicione itens à sua lista de desejos. Eles vão
            aparecer aqui.
          </span>
        </div>
      </div>
    );
  }

  return <SearchResult {...props} />;
}

export default WishlistGallery;
