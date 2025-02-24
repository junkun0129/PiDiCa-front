import { Collapse, Modal, ModalProps } from "antd";
import React, { useEffect, useState } from "react";
import { getReportItemApi } from "../../api/task.api";
import TaskAcordionNode from "../nodes/TaskAcordionNode";
type TaskDetailModalProps = {
  selectedTask: {
    task_cd: string;
    task_name: string;
    created_at: string;
    updated_at: string;
    project_name: string;
    status: string;
    task_detail: string;
  };
  ModalProps: ModalProps;
};
const TaskDetailModal = ({
  selectedTask,
  ModalProps,
}: TaskDetailModalProps) => {
  const {
    task_cd,
    task_name,
    created_at,
    updated_at,
    project_name,
    status,
    task_detail,
  } = selectedTask;

  const [dates, setdates] = useState<{ [key: string]: string[] }>({});
  const [activeKeys, setActiveKeys] = useState<{ [key: string]: string[] }>({});

  useEffect(() => {
    if (task_cd === "") return;
    getDates();
    return () => {
      setdates({});
      setActiveKeys({});
    };
  }, [task_cd]);

  const getDates = async () => {
    const res = await getReportItemApi({ task_cd: task_cd });
    if (res.result === "success") {
      setdates(res.data);
    }
  };

  const handleCollapseChange = (key: string, expandedKeys: string[]) => {
    setActiveKeys((prevState) => ({
      ...prevState,
      [key]: expandedKeys,
    }));
  };

  return (
    <Modal {...ModalProps}>
      <p>タスク名: {task_name}</p>
      <p>作成日: {created_at}</p>
      <p>更新日: {updated_at}</p>
      <p>プロジェクト名: {project_name}</p>
      <p>ステータス: {status}</p>
      <p>詳細: {task_detail}</p>
      <div>
        {Object.keys(dates).length > 0 &&
          Object.entries(dates).map(([key, value], i) => {
            return (
              <>
                <div>{key}</div>
                <Collapse
                  activeKey={activeKeys[key]}
                  accordion
                  onChange={(expandedKeys) => {
                    handleCollapseChange(key, expandedKeys);
                  }}
                  items={value.map((v, j) => ({
                    key: `${j}-${key}`, // Unique key for each item
                    label: v,
                    children: (
                      <TaskAcordionNode
                        isNodeActive={activeKeys[key]?.includes(`${j}-${key}`)}
                        task_cd={task_cd}
                        date={key}
                        timeRange={v}
                      />
                    ),
                  }))}
                />
              </>
            );
          })}
      </div>
    </Modal>
  );
};

export default TaskDetailModal;
