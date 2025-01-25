interface User {
    id: string;
    balance: number;
    firstName: string;
    lastName: string;
    userImage?: string;
    referredBy?: string;
    rank?: number;  
    completedTasks?:string[];

  };
 