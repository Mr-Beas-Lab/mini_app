import { Timestamp } from "firebase/firestore";

export const convertTimestamps = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    
    if (obj instanceof Timestamp) {
      return obj.toMillis();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(convertTimestamps);
    }
  
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertTimestamps(value)])
    );
  };