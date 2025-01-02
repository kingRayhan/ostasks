import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isBrowser = typeof window !== "undefined";

export const appFormatDate = (date?: Date | null) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getFileUrl = (file: File | string) => {
  if (typeof file === "string") {
    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${file}`;
  }
  return URL.createObjectURL(file);
};

export const getFileKeyFromUrl = (url: string) => {
  const urlParts = url.split("r2.dev/");
  return urlParts[1];
};
