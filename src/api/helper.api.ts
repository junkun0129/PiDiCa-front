import { getCookie, resetAllCookies, setCookie } from "../helpers/util";
export type ApiRes<DATA> = {
  result: string;
  data: DATA;
};
export const fetchRequest = async (
  url: string,
  method: string,
  body?: any,
  isauth: boolean = false
) => {
  try {
    const token = getCookie("pidica-token");

    const headers = new Headers();
    if (!isauth) {
      if (!token) {
        resetAllCookies();
        // window.location.href = "/signin";
      }
      headers.append("Authorization", `Bearer ${token}`);
    }

    headers.append("Content-Type", "application/json");
    const urlWithBase = `${import.meta.env.VITE_BASE_URL}${url}`;
    const response = await fetch(urlWithBase, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (response.status === 401) {
      handleAuthError();
      return { result: "failed" };
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return { result: "failed" };
  }
};

const handleAuthError = () => {
  resetAllCookies();
  window.location.href = "/signin";
};
