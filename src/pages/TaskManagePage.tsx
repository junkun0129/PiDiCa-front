import {
  App,
  Button,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tabs,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { damyTaskListData } from "../data/task";
import Search from "antd/es/transfer/search";
import {
  createTaskApi,
  CreateTaskApiReq,
  deleteTaskApi,
  getTaskListApi,
} from "../api/task.api";
import TextArea from "antd/es/input/TextArea";
import { TASK_STATUS } from "../const";
import { formatDate } from "../helpers/util";
import { getProjectEntriesApi, ProjectEntry } from "../api/project.api";

const dataIndex = {
  name: "name",
  created: "created",
  updated: "updated",
  project_name: "project_name",
  status: "status",
  detail: "detail",
};

type DataType = {
  key: string;
  name: string;
  created: string;
  updated: string;
  project_name: string;
  status: string;
  detail: string;
};

const defaultcolumns: TableColumnsType<DataType> = [
  {
    title: "タスク名",
    dataIndex: dataIndex.name,
    key: dataIndex.name,
    fixed: "left",
    width: 100,
  },
  {
    title: "詳細",
    dataIndex: dataIndex.detail,
    key: dataIndex.detail,
    width: 200,
  },
  {
    title: "ステータス",
    dataIndex: dataIndex.status,
    key: dataIndex.status,
    width: 100,
  },
  {
    title: "作成日",
    dataIndex: dataIndex.created,
    key: dataIndex.created,
    width: 200,
  },
  {
    title: "更新日",
    dataIndex: dataIndex.updated,
    key: dataIndex.updated,
    width: 200,
  },
  {
    title: "プロジェクト名",
    dataIndex: dataIndex.project_name,
    key: dataIndex.project_name,
    width: 200,
  },
];
const TaskManagePage = () => {
  // const { notification, modal } = App.useApp();
  const [modal, contextHolder] = Modal.useModal();
  const [dataSource, setdataSource] = useState<any>([]);
  const [columns, setcolumns] = useState(defaultcolumns);
  const [pagination, setpagination] = useState(10);
  const [offset, setoffset] = useState(0);
  const [sort, setsort] = useState("asc;created_at");

  const [selectedProjects, setselectedProjects] = useState("");
  const [projectEntries, setprojectEntries] = useState<ProjectEntry[]>([]);
  const [selectedRowKeys, setselectedRowKeys] = useState<string[]>([]);
  const [total, settotal] = useState(0);

  const [form] = Form.useForm();
  const [tabItems, settabItems] = useState([
    {
      label: "すべて",
      key: "",
    },
  ]);
  useEffect(() => {
    getProjectEntries();
  }, []);
  useEffect(() => {
    //data fetching
    updateTaskList({ offset, pagination, sort, project: selectedProjects });
  }, [pagination, offset, sort, selectedProjects]);
  const getProjectEntries = async () => {
    const res = await getProjectEntriesApi();
    if (res.result === "success") {
      setprojectEntries(res.data);
    }
  };
  const createTask = async ({ body }: CreateTaskApiReq) => {
    const res = await createTaskApi({
      body,
    });

    if (res.result === "success") {
    } else {
    }
  };

  const onCLickCreateTask = (entries: ProjectEntry[]) => {
    console.log("object");
    console.log(modal);

    modal.confirm({
      title: "タスク作成",
      content: (
        <div>
          <Space direction="vertical">
            <Form form={form}>
              <Form.Item required name="task_name">
                <Input name="task_name" />
              </Form.Item>
              <Form.Item name="project_cd">
                <Select>
                  {entries.map((item) => {
                    return (
                      <Select.Option
                        key={item.project_cd}
                        value={item.project_cd}
                      >
                        {item.project_name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item>
                <TextArea name="task_detail" />
              </Form.Item>
            </Form>
          </Space>
        </div>
      ),
      onOk: async (close) => {
        await createTask({
          body: {
            task_name: form.getFieldValue("task_name"),
            project_cd: form.getFieldValue("project_cd") ?? null,
            task_detail: form.getFieldValue("task_detail"),
            task_status: "1",
          },
        });
        updateTaskList({ offset, pagination, sort, project: selectedProjects });
        close();
      },
    });
  };

  const deleteTask = async () => {
    const batchSize = 10;
    let works: Promise<any>[] = [];
    let taskQueue = [...selectedRowKeys]; // 配列のコピーを作成

    for (let i = 0; i < batchSize && taskQueue.length; i++) {
      works.push(
        deleteTaskApi({ body: { task_cd: taskQueue.shift() as string } })
      );
    }

    while (taskQueue.length) {
      const finishedWork = await Promise.race(works);
      works = works.filter((work) => work !== finishedWork);
      if (taskQueue.length) {
        works.push(
          deleteTaskApi({ body: { task_cd: taskQueue.shift() as string } })
        );
      }
    }

    await Promise.all(works);
    await updateTaskList({
      offset,
      pagination,
      sort,
      project: selectedProjects,
    });
    setselectedRowKeys([]);
  };

  const updateTaskList = async ({
    offset,
    pagination,
    sort,
    project,
  }: {
    offset: number;
    pagination: number;
    sort: string;
    project: string;
  }) => {
    const res = await getTaskListApi({ offset, pagination, sort, project });
    if (res.result === "success") {
      settotal(parseInt(res.total));
      const newDataSource = res.data.map((item) => {
        const updated_at = item.updated_at ? formatDate(item.updated_at) : "";
        const created_at = formatDate(item.created_at);
        return {
          key: item.task_cd,
          name: item.task_name,
          created: created_at,
          updated: updated_at,
          project_name: item.project_name,
          status: TASK_STATUS[item.task_status as keyof typeof TASK_STATUS],
          detail: item.task_detail,
        };
      });
      setdataSource(newDataSource);
    }
  };

  const handleTabItemClick = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event.target);
    // setproject();
  };
  return (
    <Space className="h-full w-full" direction="vertical">
      {contextHolder}
      <Typography.Title level={3}>タスク管理</Typography.Title>
      <Button onClick={() => onCLickCreateTask(projectEntries)} type="primary">
        タスク作成
      </Button>

      <Tabs
        size="small"
        items={tabItems}
        defaultActiveKey=""
        activeKey={selectedProjects}
        onClick={handleTabItemClick}
      />
      <Button disabled={!selectedRowKeys.length} onClick={deleteTask}>
        タスク削除
      </Button>
      <Table
        size="small"
        dataSource={dataSource}
        scroll={{ x: 1000 }}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: (selectedRowKeys) => {
            setselectedRowKeys(selectedRowKeys as string[]);
          },
        }}
        pagination={{
          pageSize: pagination,
          current: offset / pagination + 1,
          onChange: (page, pageSize) => {
            setoffset((page - 1) * pageSize);
            setpagination(pageSize);
          },
          total,
        }}
      />

      <Modal></Modal>
    </Space>
  );
};

export default TaskManagePage;
