import { Header } from "@/components/stonfi/Header";
import { Swap } from "@/components/stonfi/SwapForm";

 
 

export default function SwapPage() {
 

  return (
    <section className="min-h-screen">
       <Header />
      <main className="container bg-gray-dark mx-auto py-8">
        <Swap />
      </main>
    </section>
  );
}
