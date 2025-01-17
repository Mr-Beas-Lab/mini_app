 
 import { telegramId } from "@/libs/telegram";
import { useSelector } from "react-redux";
 


const LeaderBoard = () => {
    const topUsers = useSelector((state: any) => state.topUsers.value);
     

    

    return (

        <section className="bg-gray-dark  mt-6  h-[400px] rounded-lg mx-6  pr-3 ">
                <h1 className="text-white font-semibold  text-xl mx-4 mt-2 text-center">Leaders Board</h1>
            <div className="h-full overflow-y-auto mt-3 hide-scrollbar pb-12">
                {topUsers.length === 0 ? (
                    <p className="text-white text-center">Loading top users...</p>
                ) : (
                    topUsers.map(({ id, balance, firstName, lastName, userImage }, idx) => (
                        <div
                            key={idx}

                            className={`${id === String(telegramId) && ""} flex items-center px-2 py-1 w-full`}
                        >
                            <div className="flex-shrink-0 mr-4">
                                <div className=" flex items-center justify-center rounded-full h-8 w-8">
                                    <p className="text-white text-sm">{idx + 1}</p>
                                </div>
                            </div>
                            <div className="flex-shrink-0 mr-2">

                                <div className=" border-yellow overflow-hidden flex items-center justify-center rounded-full bg-gray-medium h-10 w-10">
                                    {userImage ? (
                                        <img
                                            className="w-7 h-7 object-contain"
                                            src={userImage}
                                            alt={firstName.charAt(0).toUpperCase()}
                                        />
                                    ) : (

                                        <div className="text-lg text-white bg-gray-medium w-10 h-10  flex justify-center items-center">
                                        {firstName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-grow min-w-0 flex items-center justify-between">
                                <p className="text-white font-normal truncate mr-2">
                                    {firstName} {lastName}
                                </p>
                                <p className="text-white whitespace-nowrap flex-shrink-0">
                                    $ {balance}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

 
export default LeaderBoard;
