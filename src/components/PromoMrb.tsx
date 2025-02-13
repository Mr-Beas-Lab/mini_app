import { ArrowUpRightFromSquare } from "lucide-react";
const PromoMrb = () => {
  return (
    <div className="relative bg-gray-dark rounded-lg shadow-lg h-[120px] mx-10 my-5 flex items-center px-3 py-1">
      <div className="flex flex-col flex-1">
        <h1 className="text-white font-normal text-sm">
        Participate in the community Governance and Treasury with our token 
        </h1>
        <a
          href="https://t.me/blum/app?startapp=memepadjetton_MRB_3UKTM-ref_jM0CnzEvER"
          className=" flex items-center gap-1 hover:underline mt-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <b>$MRB</b> Mr Beast, buy it now
        </a>
        <small className=" flex items-center mt-1 cursor-pointer text-blue">
          Learn more <ArrowUpRightFromSquare className="w-4 h-4 ml-1" />
        </small>
      </div>

    </div>
  );
};

export default PromoMrb;
