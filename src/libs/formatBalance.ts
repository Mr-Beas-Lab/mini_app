export const formatBalance = (balance: string) => {
  // Allow digits and a single decimal point
  const numericValue = balance.replace(/[^0-9.]/g, "");

  // Parse the number and handle invalid cases
  const parsedValue = parseFloat(numericValue);

  // Check if parsedValue is a valid number
  if (isNaN(parsedValue)) {
    return "0.00"; // Return a default value if input is invalid
  }

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = numericValue.split(".");

  // Format the integer part with commas
  const formattedInteger = new Intl.NumberFormat("en-US").format(
    parseInt(integerPart, 10)
  );

  // Format the decimal part, limiting to 3 decimal places
  const formattedDecimal = decimalPart
    ? decimalPart.slice(0, 3) // Limit to 3 decimal places
    : "00"; // Default to "00" if no decimal part

  return `${formattedInteger}.${formattedDecimal} MRB`;
};