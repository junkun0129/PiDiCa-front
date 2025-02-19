import { COOKIES } from "../const";

export const getCookie = (name: string) => {
  const cookie = document.cookie;
  const cookieArray = cookie.split("; ");
  for (const c of cookieArray) {
    const [key, value] = c.split("=");
    if (key === name) {
      return value;
    }
  }
  return "";
};
export const padZero = (num: number): string => {
  return num.toString().padStart(2, "0");
};
export const setCookie = (name: string, value: string, days: number = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()}`;
};

export const resetAllCookies = () => {
  Object.values(COOKIES).forEach((cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
};

export function formatDate(isoString: string) {
  const date = new Date(isoString);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
