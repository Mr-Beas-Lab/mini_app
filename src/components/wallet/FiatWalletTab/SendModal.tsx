import { useState } from "react";
import { useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi";
import { ArrowLeft, X } from "lucide-react";
import { RootState } from "@/store/store";
import { TopUser } from "@/interface/TopUsers";

const SendModal = ({ onClose }) => {
   const topUsers = useSelector((state: RootState) => state.topUsers?.value || []);
   const [searchTerm, setSearchTerm] = useState("");
   const [selectedUser, setSelectedUser] = useState<TopUser | null>(null);
   const [amount, setAmount] = useState("");
 

  // Filter users based on search input
  const filteredUsers = topUsers.filter(
    (user) =>
      user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#1E1E1E] text-white w-full max-w-md rounded-xl overflow-hidden flex flex-col h-full max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Send Remittance</h1>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center scrollbar-hidden">
          <h3 className="text-lg font-semibold text-white mb-4">Select User</h3>
          
          {/* Search Input */}
          <div className="relative w-full mb-4">
            <input
              type="text"
              placeholder="Search user..."
              className="border rounded p-2 w-full bg-gray-800 text-white pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>

          {/* Dropdown List */}
          {searchTerm && filteredUsers.length > 0 && (
            <ul className="absolute z-10 bg-gray-800 w-full rounded shadow-lg max-h-40 overflow-y-auto">
              {filteredUsers.map((user) => (
                <li
                  key={user.id}
                  className="p-2 text-white hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setSearchTerm(`${user.firstName} ${user.lastName}`);
                  }}
                >
                  {user.firstName} {user.lastName}
                </li>
              ))}
            </ul>
          )}

          {/* Display Selected User */}
          {selectedUser && (
            <div className="p-4 bg-gray-dark rounded text-white w-full mb-4">
              <p className="font-semibold">
                {selectedUser.firstName} {selectedUser.lastName}
              </p>
              <small className="text-gray-400">User ID: {selectedUser.id}</small>
            </div>
          )}

          {/* Amount Input */}
          {selectedUser && (
            <input
              type="number"
              placeholder="Amount"
              className="border rounded p-2 w-full bg-gray-dark text-white mb-4"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          )}

          {/* Send Button */}
          <button
            className="w-full bg-blue text-white py-2 rounded disabled:opacity-50"
            disabled={!selectedUser || !amount}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendModal;