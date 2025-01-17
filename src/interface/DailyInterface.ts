import { Timestamp } from "firebase/firestore";

export interface UserDaily {
    claimedTime: Timestamp | Date | null;
    claimedDay: number;
  }
  
  export interface User {
    uid: string;
    daily?: UserDaily;
  }
  
  export interface DailyProps {
    user: User;
    dispatch: any;  
  }
  