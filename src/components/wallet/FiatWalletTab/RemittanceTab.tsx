import { useState } from "react";
import { useSelector } from "react-redux";
import { FiSearch } from "react-icons/fi"; 
import { TopUser } from "@/interface/TopUsers";

const RemittanceTab = () => {
  const topUsers = useSelector((state: any) => state.topUsers?.value || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<TopUser | null>(null);
  const [amount, setAmount] = useState("");

  // Filter users based on search input
  const filteredUsers = topUsers.filter(
    (user: any) =>
      user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Send Remittance</h3>
      <div className="space-y-4 relative">
        {/* Search Input with Icon */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search user..."
            className="border rounded p-2 w-full bg-gray-800 text-white pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
        </div>

        {/* Dropdown List of Users */}
        {searchTerm && filteredUsers.length > 0 && (
          <ul className="absolute z-10 bg-gray-800 w-full rounded shadow-lg max-h-40 overflow-y-auto">
            {filteredUsers.map((user: any) => (
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
          <div className="p-4 bg-gray-800 rounded text-white">
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
            className="border rounded p-2 w-full bg-gray-800 text-white"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        )}

        {/* Send Button */}
        <button
          className="w-full bg-blue text-white py-2 rounded"
          disabled={!selectedUser || !amount}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default RemittanceTab;
