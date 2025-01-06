import { Header } from '@/components/stonfi/Header';
 

export default function SwapPage() {
 

  return (
    <div className="min-h-screen bg-black text-white p-4">
        <Header />
      <div className="max-w-md mx-auto bg-black border border-gray-800 rounded-lg">
        <header className="flex items-center justify-between p-4 border-b border-gray-800">
          <h1 className="text-xl font-semibold flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3m0 18l4-4m0 0l-4-4m0 4H4" />
            </svg>
            Swap Tokens
          </h1>
        </header>

         
      </div>
    </div>
  );
}
