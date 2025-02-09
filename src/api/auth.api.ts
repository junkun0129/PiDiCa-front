import { fetchRequest } from "./helper.api";
type SiginInApiBody = {
  email: string;
  password: string;
};

type SigninApiRes = {
  data: {
    token: string;
    user: {
      cd: string;
      username: string;
      email: string;
    };
  };
  result: "success" | "failed";
};
export const signinApi = async (
  body: SiginInApiBody
): Promise<SigninApiRes> => {
  const response = await fetchRequest(`/auth/signin`, "POST", body, true);
  return response;
};

type SignUpApiBody = {
  username: string;
  password: string;
  email: string;
};
type SignupApiRes = {
  result: "success" | "failed";
};
export const signupApi = async (body: SignUpApiBody): Promise<SignupApiRes> => {
  const response = await fetchRequest(`/auth/signup`, "POST", body, true);
  return response;
};
