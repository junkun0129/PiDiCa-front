import { Button, Flex, Space, Table, Tabs, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { damyTaskListData } from "../data/task";
import Search from "antd/es/transfer/search";

const dataIndex = {
  name: "name",
  p: "p",
  d: "d",
  c: "c",
  a: "a",
  created: "created",
};

const columns = [
  {
    title: "タスク名",
    dataIndex: dataIndex.name,
    key: dataIndex.name,
  },
  {
    title: "P（計画）",
    dataIndex: dataIndex.p,
    key: dataIndex.p,
  },
  {
    title: "D（実施）",
    dataIndex: dataIndex.d,
    key: dataIndex.d,
  },
  {
    title: "C（チェック）",
    dataIndex: dataIndex.c,
    key: dataIndex.c,
  },
  {
    title: "A（対策）",
    dataIndex: dataIndex.a,
    key: dataIndex.a,
  },
  {
    title: "作成日",
    dataIndex: dataIndex.created,
    key: dataIndex.created,
  },
];
const TaskManagePage = () => {
  const [dataSource, setdataSource] = useState<any>([]);

  useEffect(() => {
    //data fetching
    setdataSource(damyTaskListData);
  }, []);
  return (
    <Space direction="vertical">
      <Typography.Title level={3}>タスク管理</Typography.Title>
      <Tabs
        size="small"
        items={[
          {
            label: "すべて（80）",
            key: "1",
          },
          {
            label: "カクダイ（8）",
            key: "2",
          },
        ]}
        defaultActiveKey="1"
      />
      <Space>
        <Search />
        <Button type="primary">フィルター</Button>
      </Space>
      <Table dataSource={dataSource} columns={columns} />
    </Space>
  );
};

export default TaskManagePage;
