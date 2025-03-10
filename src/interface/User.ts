interface User {
    id: string;
    balance: number;
    realBalance: number;
    firstName: string;
    lastName: string;
    userImage?: string;
    referredBy?: string;
    rank?: number;  
    completedTasks?:string[];

  };
 