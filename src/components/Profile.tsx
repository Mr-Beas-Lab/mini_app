import { useState, useEffect } from "react";
import { db } from "@/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { telegramId, firstName, profilePicture } from "@/libs/telegram";

const Profile: React.FC = () => {
  const id = String(telegramId); // Telegram user ID
  const [user, setUser] = useState<any>(null);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch all user documents
        const userCollectionRef = collection(db, "users");
        const userSnapshot = await getDocs(userCollectionRef);

        const usersList: User[] = [];
        userSnapshot.forEach((doc) => {
          const data = doc.data();
          usersList.push({
            id: doc.id,
            balance: data.balance || 0,
            firstName: data.firstName,
            lastName: data.lastName,
            userImage: data.userImage,
          });
        });

        // Sort users based on balance in descending order
        const sortedUsers = usersList.sort((a, b) => b.balance - a.balance);

        // Set the total number of users
        setTotalUsers(sortedUsers.length);

        // Find the rank of the current user
        const currentUserIndex = sortedUsers.findIndex((user) => user.id === id);
        const rank = currentUserIndex + 1; // Rank is index + 1

        // Find the specific user document using telegramId (id)
        const userRef = doc(db, "users", id); // id is the user telegram id
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          setUser({
            ...userData, // Set the user data from Firestore
            id: userSnap.id,
            rank, // Set the rank based on the position in the sorted list
          });
        } else {
          console.log(`No user found with telegramId: ${id}`);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  // Render the profile regardless of Firebase fetch
  return (
    <div className="bg-gradient-to-t from-blue-medium via-blue-light to-blue-medium rounded-lg shadow-lg w-full h-[100px] flex items-center px-4">
      {/* User Image */}
      <div className="w-12 h-12 rounded-full overflow-hidden bg-blue flex-shrink-0">
        {profilePicture ? (
          <img
            className="w-full h-full rounded-full"
            src={profilePicture}
            alt={`${firstName}'s profile`}
          />
        ) : (
          <div className="text-white text-sm bg-primary w-full h-full flex items-center justify-center">
            {firstName?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* User Name and Details */}
      <div className="ml-4 flex-1">
        <p className="text-white text-xs">Hello</p>
        <h2 className="text-white text-lg font-semibold">{firstName || "User"}</h2>
      </div>

      {/* Rank and Balance */}
      <div className="text-right text-white text-xs">
        <p>
          Rank:{" "}
          <span className="font-semibold">
            {user?.rank || "N/A"}/{totalUsers || "N/A"}
          </span>
        </p>
        <p className="font-semibold">{user?.balance || 0} PT</p>
      </div>
    </div>
  );
};

export default Profile;
