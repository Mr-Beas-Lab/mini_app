export function flattenObject(obj: Record<string, any>, parentKey = ''): Record<string, string> {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively flatten nested objects
        Object.assign(acc, flattenObject(obj[key], newKey));
      } else {
        // Convert non-object values to strings
        acc[newKey] = String(obj[key]);
      }
      return acc;
    }, {} as Record<string, string>);
  }