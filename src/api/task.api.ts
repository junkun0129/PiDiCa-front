import { fetchRequest } from "./helper.api";

type getTaskApiReq = {
  offset: number;
  pagination: number;
  sort: string;
  project: string;
};
type getTaskApiRes = {
  result: string;
  total: string;
  data: {
    task_cd: string;
    task_name: string;
    task_detail: string;
    task_status: string;
    project_name: string;
    created_at: string;
    updated_at: string;
  }[];
};

export type ReportItemView = {
  ri_cd: string;
  report_cd: string;
  task_cd: string;
  ri_starttime: number;
  ri_endtime: number;
  ri_check: string;
  ri_do: string;
  ri_action: string;
  ri_plan: string;
  created_at: string;
};

export const getTaskListApi = async (
  req: getTaskApiReq
): Promise<getTaskApiRes> => {
  const url =
    "/task/list" +
    `?offset=${req.offset}&pagination=${req.pagination}&sort=${req.sort}&project=${req.project}`;
  const response = await fetchRequest(url, "get");
  return response;
};

export type CreateTaskApiReq = {
  body: {
    task_name: string;
    project_cd: string;
    task_detail: string;
    task_status: string;
  };
};

type CreateTaskApiRes = {
  result: string;
};

export const createTaskApi = async (
  req: CreateTaskApiReq
): Promise<CreateTaskApiRes> => {
  const url = "/task/create";
  const response = await fetchRequest(url, "post", req.body);
  return response;
};

export type DeleteTaskApiReq = {
  body: { task_cd: string };
};

export type DeleteTaskApiRes = {
  result: string;
};

export const deleteTaskApi = async (
  req: DeleteTaskApiReq
): Promise<DeleteTaskApiRes> => {
  const url = "/task/delete";
  const response = await fetchRequest(url, "post", req.body);
  return response;
};

export type GetReportItemDatesReq = {
  task_cd: string;
};

export type GetReportItemDatesRes = {
  result: string;
  data: { [key: string]: string[] };
};

export const getReportItemApi = async (
  req: GetReportItemDatesReq
): Promise<GetReportItemDatesRes> => {
  const url = `/task/items/dates?task_cd=${req.task_cd}`;
  const response = await fetchRequest(url, "get");
  return response;
};

export type GetReportItemDetailReq = {
  task_cd: string;
  starttime: number;
  endtime: number;
  date: string;
};
export type GetReportItemDetailRes = {
  result: string;
  data: ReportItemView;
};

export const getReportItemDetailApi = async (
  req: GetReportItemDetailReq
): Promise<GetReportItemDetailRes> => {
  const url = `/task/items/detail?task_cd=${req.task_cd}&date=${req.date}&starttime=${req.starttime}&endtime=${req.endtime}`;
  const response = await fetchRequest(url, "get");
  return response;
};
