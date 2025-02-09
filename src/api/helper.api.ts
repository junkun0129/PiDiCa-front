import { getCookie } from "../helpers/util";

export const fetchRequest = async (url: string, method: string, body?: any) => {
  const token = getCookie("pidica-token");
  const headers = new Headers();
  headers.append("Authorization", `Bearer ${token}`);
  headers.append("Content-Type", "application/json");
  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  return response;
};
