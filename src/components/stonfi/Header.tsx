
import { TonConnectButton } from "@tonconnect/ui-react";

export function Header() {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background justify-between">
      <section className="container flex items-center gap-4">
        <a
          href="https://ston.fi"
          target="_blank noopener noreferrer"
          className="hover:opacity-80 transition-opacity relative mr-auto"
        >
  
        </a>

        <TonConnectButton />
        <a
          href="https://github.com/ston-fi/omniston-sdk"
          target="_blank noopener noreferrer"
          className="hover:opacity-60 transition-opacity text-red-400"
        >
        </a>
        <a
          href="https://docs.ston.fi/docs/developer-section/omniston"
          target="_blank noopener noreferrer"
          className="hover:opacity-60 transition-opacity"
        >
        </a>
      </section>
    </header>
  );
}