import {
  Button,
  Col,
  Collapse,
  Divider,
  message,
  Modal,
  ModalProps,
  Row,
  Segmented,
  Select,
} from "antd";
import { useEffect, useState } from "react";
import {
  getReportItemApi,
  getTaskApi,
  updateTaskApi,
} from "../../api/task.api";
import TaskAcordionNode from "../nodes/TaskAcordionNode";
import dayjs from "dayjs";
import Paragraph from "antd/es/typography/Paragraph";
import { TASK_STATUS, TASK_STATUS_REVERSE } from "../../const";
import { getProjectEntriesApi, ProjectEntry } from "../../api/project.api";
type TaskDetailModalProps = {
  selectedCd: string;
  ModalProps: ModalProps;
  updateTable: () => void;
};
const TaskDetailModal = ({
  selectedCd,
  ModalProps,
  updateTable,
}: TaskDetailModalProps) => {
  const [dates, setdates] = useState<{ [key: string]: string[] }>({});
  const [activeKeys, setActiveKeys] = useState<{ [key: string]: string[] }>({});
  const [taskName, settaskName] = useState("");
  const [projectcd, setprojectcd] = useState("");
  const [reportStatus, setreportStatus] = useState<
    keyof typeof TASK_STATUS | ""
  >("");
  const [taskDetail, settaskDetail] = useState("");
  const [updatedAt, setupdatedAt] = useState("");
  const [createdAt, setcreatedAt] = useState("");
  const [projectEntries, setprojectEntries] = useState<ProjectEntry[]>([]);
  const [popupmessage, messageHoleder] = message.useMessage();

  useEffect(() => {
    if (selectedCd === "") return;
    getDates(selectedCd);
    updateTask(selectedCd);
    updateProjectEntries();
    return () => {
      setdates({});
      setActiveKeys({});
      settaskName("");
      settaskDetail("");
      setprojectcd("");
      setupdatedAt("");
      setcreatedAt("");
    };
  }, [selectedCd]);

  const updateProjectEntries = async () => {
    const res = await getProjectEntriesApi();
    if (res.result === "success") {
      setprojectEntries(res.data);
    }
  };

  const updateTask = async (cd: string) => {
    const res = await getTaskApi({ task_cd: cd });
    if (res.result !== "success") return;
    const { data } = res;
    settaskName(data.task_name);
    settaskDetail(data.task_detail);
    setprojectcd(data.project_cd);
    setupdatedAt(data.updated_at);
    setcreatedAt(data.created_at);
  };

  const getDates = async (cd: string) => {
    const res = await getReportItemApi({ task_cd: cd });
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

  const saveTask = async ({
    task_cd,
    task_name,
    project_cd,
    task_detail,
    task_status,
  }: {
    task_cd: string;
    task_name: string;
    project_cd: string;
    task_detail: string;
    task_status: string;
  }) => {
    const res = await updateTaskApi({
      body: {
        task_cd,
        task_name,
        project_cd,
        task_detail,
        task_status,
      },
    });
    if (res.result === "success") {
      popupmessage.success("タスクの更新に成功しました");
    } else {
      popupmessage.error("タスクの更新に失敗しました");
    }
    updateTask(task_cd);
    updateTable();
  };

  return (
    <Modal
      {...ModalProps}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
    >
      {messageHoleder}
      <div className="mx-10">
        {/* {Object.entries(index).map(([key, value], i) => {
          return (
            <>
              {i === 0 && <Divider />}
              <Row>
                <Col span={12} className="font-bold">
                  {key}
                </Col>
                <Col span={12}>{value}</Col>
              </Row>
              <Divider />
            </>
          );
        })} */}
        <Divider />
        <Row>
          <Col className="font-bold" span={12}>
            タスク名
          </Col>
          <Col span={12}>
            <Paragraph
              editable={{
                onChange: settaskName,
                text: taskName,
              }}
            >
              {taskName}
            </Paragraph>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col className="font-bold" span={12}>
            タスク詳細
          </Col>
          <Col span={12}>
            <Paragraph
              editable={{
                onChange: settaskDetail,
                text: taskDetail,
              }}
            >
              {taskDetail}
            </Paragraph>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col className="font-bold" span={12}>
            ステータス
          </Col>
          <Col span={12}>
            <Segmented
              value={
                reportStatus === ""
                  ? "未着手"
                  : TASK_STATUS[reportStatus as keyof typeof TASK_STATUS]
              }
              options={["未着手", "進行中", "完了済"]}
              onChange={(e) =>
                setreportStatus(
                  TASK_STATUS_REVERSE[
                    e as keyof typeof TASK_STATUS_REVERSE
                  ] as keyof typeof TASK_STATUS
                )
              }
            />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col className="font-bold" span={12}>
            プロジェクト
          </Col>
          <Col span={12}>
            <Select
              value={
                projectEntries.find((item) => item.project_cd === projectcd)
                  ? projectEntries.find((item) => item.project_cd === projectcd)
                      ?.project_name
                  : ""
              }
              options={projectEntries.map((item, i) => ({
                value: item.project_cd,
                label: item.project_name,
              }))}
            ></Select>
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col className="font-bold" span={12}>
            作成日
          </Col>
          <Col span={12}>{dayjs(createdAt).format("YYYY年M月D日") ?? ""}</Col>
        </Row>
        <Divider />
        <Row>
          <Col className="font-bold" span={12}>
            更新日
          </Col>
          <Col span={12}>{dayjs(updatedAt).format("YYYY年M月D日") ?? ""}</Col>
        </Row>

        <Divider />
        <div className="w-full flex justify-end mb-10 -mt-4">
          <Button
            onClick={() =>
              saveTask({
                task_cd: selectedCd,
                task_name: taskName,
                task_detail: taskDetail,
                project_cd: projectcd,
                task_status: reportStatus,
              })
            }
            type="primary"
          >
            保存
          </Button>
        </div>
        <div>
          <div className="font-bold">日報に使用された際の詳細</div>
          {Object.keys(dates).length > 0 &&
            Object.entries(dates).map(([key, value]) => {
              return (
                <div className="my-3">
                  <div>{dayjs(key).format("YYYY年M月D日")}</div>
                  <Collapse
                    activeKey={activeKeys[key]}
                    accordion
                    onChange={(expandedKeys) => {
                      handleCollapseChange(key, expandedKeys);
                    }}
                    items={value.map((range, j) => ({
                      key: `${j}-${key}`,
                      label: toRnage(range),
                      children: (
                        <TaskAcordionNode
                          isNodeActive={activeKeys[key]?.includes(
                            `${j}-${key}`
                          )}
                          task_cd={selectedCd}
                          date={key}
                          timeRange={range}
                        />
                      ),
                    }))}
                  />
                </div>
              );
            })}
          <Divider />
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;

const toRnage = (range: string) => {
  const splitted = range.split("-");
  if (splitted.length !== 2) return "";
  const starttime = splitted[0] + "時";
  const endtime = splitted[1] + "時";
  return starttime + " ~ " + endtime;
};
