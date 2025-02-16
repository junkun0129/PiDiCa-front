import { fetchRequest } from "./helper.api";

type GetCretedByMonthReq = {
  date: string;
  status: string;
};

type GetCretedByMonthRes = {
  result: string;
  data: any[];
};

export const getCreatedByMonthApi = async (
  req: GetCretedByMonthReq
): Promise<GetCretedByMonthRes> => {
  const url =
    "/report/createdbymonth" + "?date=" + req.date + "&status=" + req.status;
  const res = await fetchRequest(url, "get");
  return res;
};

type CreateReportReq = {
  body: {
    report_date: string;
    report_status: string;
    report_workhour: string;
    report_items: {
      task_cd: string;
      starttime: string;
      endtime: string;
      check: string;
      do: string;
      plan: string;
      action: string;
    }[];
  };
};

type CreateReportRes = {
  result: string;
};

export const createReportApi = async (
  req: CreateReportReq
): Promise<CreateReportRes> => {
  const url = "/report/create";
  const res = await fetchRequest(url, "post", req.body);
  return res;
};
type GetReportListApiReq = {
  date: string;
  offset: number;
  pagination: number;
};

export const getReportListApi = async (
  req: GetReportListApiReq
): Promise<any> => {
  const url = `/report/list?offset=${req.offset}&pagination=${req.pagination}&date=${req.date}`;
  const res = await fetchRequest(url, "get");
  return res;
};
