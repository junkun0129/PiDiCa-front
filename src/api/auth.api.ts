import { fetchRequest } from "./helper.api";
type SiginInApiBody = {
  username: string;
  password: string;
};
const signupApi = async (body: SiginInApiBody) => {
  const response = await fetchRequest(`/auth/signup`, "POST", body);
  return response;
};

type SIgnUpApiBody = {
  username: string;
  password: string;
  email: string;
};
const signinApi = async (body: SIgnUpApiBody) => {
  const response = await fetchRequest(`/auth/signin`, "POST", body);
  return response;
};
