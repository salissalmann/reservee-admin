/**
 * Utility functions for safe handling of potentially undefined or null values
 */

export const SafeHandlers = {
  /**
   * Safely get the first character of a string, with fallback
   * @param value Input string
   * @param fallback Fallback value if string is invalid
   * @returns First uppercase character or fallback
   */
  getFirstChar: (value?: string, fallback: string = "N/A"): string => {
    if (!value) return fallback;
    return value[0]?.toUpperCase() || fallback;
  },

  /**
   * Safely split a string and get the first part
   * @param value Input string
   * @param separator Separator to split by
   * @param fallback Fallback value if split fails
   * @returns First part of the split string or fallback
   */
  getSplitFirst: (
    value?: string,
    separator: string = "@",
    fallback: string = "Unknown"
  ): string => {
    if (!value) return fallback;
    const parts = value.split(separator);
    return parts[0] || fallback;
  },

  /**
   * Safely get a value or return a fallback
   * @param value Input value
   * @param fallback Fallback value
   * @returns Original value or fallback
   */
  getOrDefault: <T>(value: T | undefined | null, fallback: T): T => {
    return value ?? fallback;
  },

  /**
   * Safely convert a value to lowercase
   * @param value Input string
   * @returns Lowercase string or empty string
   */
  safeToLowerCase: (value?: string): string => {
    return value?.toLowerCase() || "";
  },

  /**
   * Generate a safe unique key
   * @param id Optional id to use
   * @returns Unique key
   */
  generateSafeKey: (id?: string | number): string | number => {
    return id || Math.random();
  },

  /**
   * Safely map an array with fallback
   * @param array Input array
   * @param fallback Fallback array
   * @returns Mapped array or fallback
   */
  safeMap: <T, U>(
    array: T[] | undefined | null,
    mapFn: (item: T) => U,
    fallback: U[] = []
  ): U[] => {
    return (array || []).map(mapFn);
  },

  /**
   * Safely filter an array
   * @param array Input array
   * @param filterFn Filter condition
   * @returns Filtered array
   */
  safeFilter: <T>(
    array: T[] | undefined | null,
    filterFn: (item: T) => boolean
  ): T[] => {
    return (array || []).filter(filterFn);
  },
};
