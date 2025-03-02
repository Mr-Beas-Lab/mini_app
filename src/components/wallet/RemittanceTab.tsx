import { useState } from "react";
import Select from "react-select";
import { useSelector } from "react-redux";

const RemittanceTab = () => {
  const topUsers = useSelector((state: any) => state.topUsers.value);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState("");

  // Transform users for react-select
  const userOptions = topUsers.map((user: any) => ({
    value: user.id, // Assuming user ID is stored as 'id'
    label: `${user.firstName} ${user.lastName}`, // Display name
  }));

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Send Remittance</h3>
      <div className="space-y-4">
        {/* Searchable Dropdown for User Selection */}
        <Select
          options={userOptions}
          value={selectedUser}
          onChange={(selectedOption) => setSelectedUser(selectedOption)}
          placeholder="Search and select user"
          className="text-black"
        />

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Amount"
          className="border rounded p-2 w-full bg-gray-dark text-white"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

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
