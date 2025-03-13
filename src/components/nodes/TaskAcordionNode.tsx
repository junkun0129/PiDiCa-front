import { useEffect, useState } from "react";
import { getReportItemDetailApi, ReportItemView } from "../../api/task.api";
import { Col, Divider, Row } from "antd";
import dayjs from "dayjs";
type TaskAcordionNodeProps = {
  isNodeActive: boolean;
  timeRange: string;
  date: string;
  task_cd: string;
};
const TaskAcordionNode = ({
  isNodeActive,
  task_cd,
  date,
  timeRange,
}: TaskAcordionNodeProps) => {
  if (!isNodeActive) return;
  const starttime = parseInt(timeRange.split("-")[0]);
  const endtime = parseInt(timeRange.split("-")[1]);
  if (isNaN(starttime) || isNaN(endtime)) return;
  const [selectedItem, setselectedItem] = useState<ReportItemView>({
    ri_cd: "",
    report_cd: "",
    task_cd: "",
    ri_starttime: 0,
    ri_endtime: 0,
    ri_check: "",
    ri_do: "",
    ri_action: "",
    ri_plan: "",
    created_at: "",
  });
  useEffect(() => {
    getitems();
  }, []);

  const getitems = async () => {
    const res = await getReportItemDetailApi({
      task_cd,
      date,
      starttime,
      endtime,
    });
    if (res.result === "success") {
      setselectedItem(res.data);
    }
  };

  return (
    <div>
      {/* <p>task_cd: {task_cd}</p> */}
      {/* <p>ri_cd: {selectedItem.ri_cd}</p> */}
      {/* <p>report_cd: {selectedItem.report_cd}</p> */}
      <Divider className="my-2" />
      <Row>
        <Col span={12}>開始時間</Col>
        <Col span={12}>{selectedItem.ri_starttime}時</Col>
      </Row>
      <Divider className="my-2" />
      <Row>
        <Col span={12}>終了時間</Col>
        <Col span={12}>{selectedItem.ri_endtime}時</Col>
      </Row>
      <Divider className="my-2" />
      <Row>
        <Col span={12}>計画</Col>
        <Col span={12}>{selectedItem.ri_plan}</Col>
      </Row>
      <Divider className="my-2" />
      <Row>
        <Col span={12}>実行</Col>
        <Col span={12}>{selectedItem.ri_do}</Col>
      </Row>
      <Divider className="my-2" />
      <Row>
        <Col span={12}>評価</Col>
        <Col span={12}>{selectedItem.ri_check}</Col>
      </Row>
      <Divider className="my-2" />
      <Row>
        <Col span={12}>改善</Col>
        <Col span={12}>{selectedItem.ri_action}</Col>
      </Row>
      <Divider className="my-2" />
      <Row>
        <Col span={12}>作成時刻</Col>
        <Col span={12}>
          {dayjs(selectedItem.created_at).format("YYYY年M月D日")}
        </Col>
      </Row>
      <Divider className="my-2" />
    </div>
  );
};

export default TaskAcordionNode;
