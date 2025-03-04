import { fetchRequest } from "./helper.api";
type GetAttendReq = {
  yearmonth: string;
};
type GetAttendRes = {
  result: string;
  data: {
    rows: string[][];
    status: string;
  };
};

export const getAttendApi = async (
  req: GetAttendReq
): Promise<GetAttendRes> => {
  const url = `/attend/get?yearmonth=${req.yearmonth}`;
  const res = await fetchRequest(url, "get");

  return res;
};

type SubmitAttendReq = {
  yearmonth: string;
  monthly: {
    workhours: number;
    night: number;
    over: number;
  };
  daily: string | number[][];
};

type SubmitAttendRes = {
  result: string;
};

export const submitAttendApi = async (
  req: SubmitAttendReq
): Promise<SubmitAttendRes> => {
  const url = `/attend/submit`;
  const res = await fetchRequest(url, "post", req);
  return res;
};
