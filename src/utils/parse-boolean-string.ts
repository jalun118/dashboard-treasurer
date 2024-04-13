export function ParseBooleanString(data: any): boolean {
  if (typeof data === "string") {
    if (data.toLowerCase() === "true") return true;
    if (data.toLowerCase() === "false") return false;
    throw new Error("cannot be boolean string");
  }
  if (typeof data === "boolean") {
    return data;
  }
  throw new Error("cannot be boolean string");
}