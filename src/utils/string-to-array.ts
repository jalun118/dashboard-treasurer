interface valueFunction<T> {
  error: string | null;
  data: T[] | null;
}

export function stringToArray<T>(str: string): valueFunction<T> {
  try {
    const parsed = JSON.parse(str) as T[];

    if (!Array.isArray(parsed)) {
      return {
        data: null,
        error: "parsing result is not an array"
      };
    }

    for (const element of parsed) {
      if (typeof element !== "number") {
        return {
          data: null,
          error: "array elements are not numbers"
        };
      }
    }

    return {
      data: parsed,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error: "string does not match JSON format"
    };
  }
}