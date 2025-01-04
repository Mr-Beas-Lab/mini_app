
import lock from '@/assets/lock.png';

const BuyToken = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm z-50">
      <div className="bg-gradient-to-r bg-gray-dark mx-12 rounded-lg shadow-lg p-8 w-96">
        <button
          onClick={onClose}
          className="absolute top-28 right-12 text-3xl   text-gray-300 transition duration-200 ease-in-out flex items-center justify-center w-10 h-10"
        >
          &times;
        </button>
        <div className="flex flex-col items-center text-white">
          <img
            src={lock}
            alt="Lock"
            className="w-24 h-24 mb-6"
          />
          <h2 className="text-2xl font-bold mb-3">
            Access Locked!
          </h2>
          <p className="text-sm text-gray-200 text-center mb-6">
            You need our <span className="font-semibold text-blue-300">MRB token</span> in your wallet to access the premium analyzer.
          </p>
          <button
            className="bg-gradient-to-r from-blue-light to-blue-medium text-white py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out" 
          >
            <a href="https://t.me/blum/app?startapp=memepadjetton_MRB_3UKTM-ref_jM0CnzEvER">
              Get The Token
            </a>
            
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyToken;
