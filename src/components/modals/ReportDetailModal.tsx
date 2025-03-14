import { Col, Collapse, Modal, ModalProps, Row } from "antd";
import { ReportView } from "../../api/report.api";
import { useState } from "react";
import { REPORT_MODE, REPORT_MODE_FROM_BACK } from "../../const";

type ReportDetailModalProps = {
  data: ReportView | null;
  modalProps: ModalProps;
};
const ReportDetailModal = ({ data, modalProps }: ReportDetailModalProps) => {
  const [activeKeys, setactiveKeys] = useState<string[]>([]);
  console.log(data);
  return (
    <Modal {...modalProps}>
      {data !== null && (
        <div>
          <Row>
            <Col span={12}>日付</Col>
            <Col span={12}>{data.report_date}</Col>
          </Row>
          <Row>
            <Col span={12}>ステータス</Col>
            <Col span={12}>{data.report_status}</Col>
          </Row>
          <Row>
            <Col span={12}>労働時間</Col>
            <Col span={12}>{data.report_workhour}時間</Col>
          </Row>
          <Row>
            <Col span={12}>作成時間</Col>
            <Col span={12}>{data.report_created_at}</Col>
          </Row>
          {data !== null && (
            <Collapse
              activeKey={activeKeys}
              accordion
              onChange={(keys) => setactiveKeys(keys)}
              items={data.reportitems.map((item, i) => ({
                key: i + "reportac",
                label: `${item.tasks.task_name} ( ${item.ri_starttime}時 ~ ${item.ri_endtime}時 )`,
                children: (
                  <div>
                    <Row>
                      <Col span={12}>計画</Col>
                      <Col span={12}>{item.tasks.ri_plan}</Col>
                    </Row>
                    {REPORT_MODE_FROM_BACK[data.report_status] ===
                      REPORT_MODE["ACTION"] && (
                      <Row>
                        <Col span={12}>実行</Col>
                        <Col span={12}>{item.tasks.ri_do}</Col>
                      </Row>
                    )}
                    {REPORT_MODE_FROM_BACK[data.report_status] ===
                      REPORT_MODE["ACTION"] && (
                      <Row>
                        <Col span={12}>評価</Col>
                        <Col span={12}>{item.tasks.ri_check}</Col>
                      </Row>
                    )}
                    {REPORT_MODE_FROM_BACK[data.report_status] ===
                      REPORT_MODE["ACTION"] && (
                      <Row>
                        <Col span={12}>改善</Col>
                        <Col span={12}>{item.tasks.ri_action}</Col>
                      </Row>
                    )}
                  </div>
                ),
              }))}
            />
          )}
        </div>
      )}
    </Modal>
  );
};

export default ReportDetailModal;
