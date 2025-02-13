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
import { getProjectListApi, ProjectListView } from "../api/project.api";

const dataIndex = {
  project_name: "project_name",
  created_at: "created",
  updated_at: "updated",
  task_count: "task_count",
  user_count: "user_count",
  your_status: "your_status",
  created_by: "created_by",
};

type DataType = {
  key: string;
  project_name: string;
  created_at: string;
  updated_at: string;
  task_count: string;
  user_count: string;
  your_status: string;
  created_by: string;
};

const defaultcolumns: TableColumnsType<DataType> = [
  {
    title: "プロジェクト名",
    dataIndex: dataIndex.project_name,
    key: dataIndex.project_name,
    fixed: "left",
    width: 200,
  },
  {
    title: "作成日",
    dataIndex: dataIndex.created_at,
    key: dataIndex.created_at,
    width: 200,
  },
  {
    title: "更新日",
    dataIndex: dataIndex.updated_at,
    key: dataIndex.updated_at,
    width: 200,
  },
  {
    title: "作成者",
    dataIndex: dataIndex.created_by,
    key: dataIndex.created_by,
    width: 200,
  },
  {
    title: "会員数",
    dataIndex: dataIndex.user_count,
    key: dataIndex.user_count,
    width: 200,
  },
  {
    title: "あなたのポジション",
    dataIndex: dataIndex.your_status,
    key: dataIndex.your_status,
    width: 200,
  },
  {
    title: "タスク数",
    dataIndex: dataIndex.task_count,
    key: dataIndex.task_count,
    width: 200,
  },
];
const ProjectManagePage = () => {
  // const { notification, modal } = App.useApp();
  const [modal, contextHolder] = Modal.useModal();
  const [dataSource, setdataSource] = useState<DataType[]>([]);
  const [columns, setcolumns] = useState(defaultcolumns);
  const [pagination, setpagination] = useState(10);
  const [offset, setoffset] = useState(0);
  const [sort, setsort] = useState("asc;created_at");
  const [projects, setprojects] = useState<ProjectListView[]>([]);
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
    //data fetching
    updateTaskList({ offset, pagination });
  }, [pagination, offset]);

  const createTask = async ({ body }: CreateTaskApiReq) => {
    const res = await createTaskApi({
      body,
    });

    if (res.result === "success") {
    } else {
    }
  };

  const onCLickCreateTask = () => {
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
                  {["project_cd1", "project_cd2"].map((item) => {
                    return (
                      <Select.Option key={item} value={item}>
                        {item}
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
    setselectedRowKeys([]);
  };

  const updateTaskList = async ({
    offset,
    pagination,
  }: {
    offset: number;
    pagination: number;
  }) => {
    console.log("object");
    const res = await getProjectListApi({
      offset,
      pagination,
    });

    if (res.result === "success") {
      let newDataSource: DataType[] = [];
      res.data.forEach((p) => {
        const updated_at = formatDate(p.updated_at);
        const created_at = formatDate(p.created_at);
        console.log(created_at);
        newDataSource.push({
          key: p.project_cd,
          project_name: p.project_name,
          created_at: created_at,
          updated_at: updated_at,
          task_count: p._count.tasks.toString(),
          user_count: p._count.membercards.toString(),
          created_by: p.membercards[0].users.user_name,
          your_status: p.membercards[0].status.toString(),
        });
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
      <Button onClick={onCLickCreateTask} type="primary">
        プロジェクト作成
      </Button>

      <Button disabled={!selectedRowKeys.length} onClick={deleteTask}>
        プロジェクト削除
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

export default ProjectManagePage;
