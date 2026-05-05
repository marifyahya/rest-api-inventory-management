import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const APP_TIMEZONE = process.env.TIME_ZONE || "UTC";

/**
 * Format a date based on the TIME_ZONE from environment variables
 * @param date - The date to format
 * @param format - The desired output format (default: YYYY-MM-DD HH:mm:ss)
 * @returns Formatted date string
 */
export const formatTime = (date: Date | string | number, format: string = "YYYY-MM-DD HH:mm:ss") => {
  return dayjs(date).tz(APP_TIMEZONE).format(format);
};

/**
 * Transform an object or array of objects by formatting its date fields using the app timezone
 * @param data - The object or array to transform
 * @param fields - The date fields to format (default: ['createdAt', 'updatedAt'])
 * @returns Transformed data
 */
export const withLocalTime = <T extends Record<string, any>>(
  data: T | T[],
  fields: string[] = ["createdAt", "updatedAt"],
): any => {
  if (Array.isArray(data)) {
    return data.map((item) => withLocalTime(item, fields));
  }

  // Cast to any to allow dynamic property assignment on generic type T
  const transformed: any = { ...data };
  fields.forEach((field) => {
    if (transformed[field]) {
      transformed[field] = formatTime(transformed[field]);
    }
  });

  return transformed;
};
