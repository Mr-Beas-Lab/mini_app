// Helper function to format the balance
export const formatBalance = (balance: string) => {
    // Remove the "MRB" suffix if present
    const numericValue = balance.replace(/MRB$/, "");
  
    // Convert to a number and format with commas
    const formatted = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(Number(numericValue));
  
    return formatted;
  };