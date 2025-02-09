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

export const setCookie = (name: string, value: string, days: number = 1) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()}`;
};
