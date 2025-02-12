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
