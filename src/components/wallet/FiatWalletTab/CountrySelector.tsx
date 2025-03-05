import { X } from "lucide-react";

type CountrySelectorProps = {
  onSelect: (country: string) => void;
  onClose: () => void;
};

const CountrySelector = ({ onSelect, onClose }: CountrySelectorProps) => {
  const countries = [
    { name: "Venezuelan Bolivar", code: "VES", flag: "https://flagcdn.com/ve.svg" },
    { name: "Colombian Peso", code: "COP", flag: "https://flagcdn.com/co.svg" },
    { name: "Argentina Peso", code: "ARS", flag: "https://flagcdn.com/ar.svg" },
    { name: "Mexican Peso", code: "MXN", flag: "https://flagcdn.com/mx.svg" },
    { name: "Brazilian Real", code: "BRL", flag: "https://flagcdn.com/br.svg" },
    { name: "Chilean Peso", code: "CLP", flag: "https://flagcdn.com/cl.svg" },
    { name: "Guatemalan Quetzal", code: "GTQ", flag: "https://flagcdn.com/gt.svg" },
    { name: "Euro", code: "EUR", flag: "https://flagcdn.com/eu.svg" }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      <div className="bg-gray-dark text-white w-full max-w-md rounded-xl overflow-hidden flex flex-col h-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4 px-4 py-3">
          <h2 className="text-lg font-bold">Choose payment currency</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-3 px-4 overflow-y-scroll scrollbar-hidden">
          {countries.map(({ name, code, flag }) => (
            <button
              key={code}
              onClick={() => onSelect(code)}
              className="flex justify-between items-center w-full p-3 bg-gray-dark rounded-md text-left hover:bg-gray-700 focus:outline-none"
            >
              <span className="flex items-center">
                <img src={flag} alt={`${name} flag`} className="w-5 h-5 mr-2" />
                {name}
              </span>
              <span className="text-gray-400">{code}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountrySelector;
