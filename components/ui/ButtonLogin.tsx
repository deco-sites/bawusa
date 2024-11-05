import { useUser } from "deco-sites/std/packs/vtex/hooks/useUser.ts";
import { useSignal } from "@preact/signals";
import Button from "$store/components/ui/Button.tsx";
import Icon from "$store/components/ui/Icon.tsx";

export default function ButtonLogin() {
  const { user } = useUser();
  const vtexIdScriptsLoaded = useSignal(false);

  const isUserLoggedIn = Boolean(user.value?.email);
  return (
    <Button
      as="button"
      href="/account"
      aria-label="Log in"
      class="bg-transparent hover:bg-transparent border-none hover:scale-125 text-black"
      onClick={async () => {
        if (isUserLoggedIn) {
          window.location.pathname = "/account";
        } else {
          const execute = () => {
            vtexIdScriptsLoaded.value = true;
            // deno-lint-ignore ban-ts-comment
            // @ts-expect-error
            window.vtexid.start({
              userEmail: "",
              locale: "pt-BR",
              forceReload: false,
            });
          };
          if (!vtexIdScriptsLoaded.value) {
            const { loadVtexIdScripts } = await import(
              "site/sdk/login.tsx"
            );
            loadVtexIdScripts(execute);
          } else {
            execute();
          }
        }
      }}
    >
      <Icon id="BawLogin" width={25} height={25} strokeWidth={0.4} />
    </Button>
  );
}
