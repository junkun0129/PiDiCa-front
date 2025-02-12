import { ApiRes, fetchRequest } from "./helper.api";
export type ProjectListView = {
  created_at: string;
  updated_at: string;
  project_cd: string;
  project_name: string;
  created_by: string;
  membercards: {
    status: string;
    users: {
      user_name: string;
    };
  }[];
  _count: {
    membercards: number;
    tasks: number;
  };
};
type GetProjectsListReq = {
  offset: number;
  pagination: number;
};

type GetProjectsListRes = {
  result: string;
  data: ProjectListView[];
};

export const getProjectListApi = async (
  req: GetProjectsListReq
): Promise<GetProjectsListRes> => {
  const url = `/project/list?offset=${req.offset}&pagination=${req.pagination}`;
  const res = await fetchRequest(url, "get");

  return res;
};

export type ProjectEntry = {
  project_name: string;
  project_cd: string;
};

export const getProjectEntriesApi = async (): Promise<
  ApiRes<ProjectEntry[]>
> => {
  const url = "/project/entries";
  const res = await fetchRequest(url, "get");
  return res;
};
