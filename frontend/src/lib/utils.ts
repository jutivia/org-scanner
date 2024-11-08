import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Iquery } from "./type";
import { queryKeys } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const constructQueryString = (query: Iquery) => {
    let queryString = "";
    const length = Object.values(query).length - 1;
    queryKeys.map((x, i) => {
      if (query[x]) queryString += `${x}=${query[x]}${i < length ? "&" : ""}`;
      return x;
    });
    return queryString;
  };