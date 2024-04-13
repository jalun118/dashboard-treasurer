export function FormatMoneyId(number: number) {
  const numberString = number.toString();
  const parts = numberString.split(".");
  const reversedInteger = parts[0].split("").reverse().join("");
  const formattedInteger = reversedInteger.replace(/(\d{3})(?!$)/g, "$1.");
  const formattedNumber = "Rp" + formattedInteger.split("").reverse().join("") + (parts[1] ? "." + parts[1] : "");
  return formattedNumber;
}

export function isSameArray<T>(...arrays: T[][]): boolean {
  if (arrays.length === 0) {
    return true;
  }
  const baseArray = arrays[0];
  return arrays.every(
    array => array.length === baseArray.length && array.every((element, i) => element === baseArray[i])
  );
}

export function isEmpityString(data: string): boolean {
  try {
    if (data.trim() === "" || data.trim().length < 1) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}