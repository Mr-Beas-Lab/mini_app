import oip from "@/assets/OIP (2).jpg";

const Chart = () => {
  return (
    <div className="bg-gray-dark p-3 rounded-md shadow-md w-80 mx-auto mt-10">
      <h2 className="text-white text-center text-sm font-semibold mb-2">
        MRBUSD
      </h2>
      <img
        src={oip}
        alt="MRB Token Chart"
        className="w-full h-[150px] object-cover rounded-md"
      />
    </div>
  );
};

export default Chart;
