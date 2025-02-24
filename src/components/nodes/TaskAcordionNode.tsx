import React, { useEffect, useState } from "react";
import {
  getReportItemApi,
  getReportItemDetailApi,
  ReportItemView,
} from "../../api/task.api";
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
      <p>開始時間: {selectedItem.ri_starttime}</p>
      <p>終了時間: {selectedItem.ri_endtime}</p>
      <p>計画: {selectedItem.ri_plan}</p>
      <p>実行: {selectedItem.ri_do}</p>
      <p>評価: {selectedItem.ri_check}</p>
      <p>改善: {selectedItem.ri_action}</p>
      <p>作成時刻: {selectedItem.created_at}</p>
    </div>
  );
};

export default TaskAcordionNode;
