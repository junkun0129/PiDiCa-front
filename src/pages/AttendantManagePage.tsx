import { useState } from "react";
import { Button, message, Space, Typography } from "antd";
import dayjs from "dayjs";
import useSpreadsheet from "../hooks/useSpreadSheet";
import useModal from "antd/es/modal/useModal";
import ChangeSelectedMonthButton from "../components/buttons/ChangeSelectedMonthButton";
const AttendantManagePage = () => {
  const [selectedDate, setselectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM")
  );

  const { jssRef, attendStatus, handleSubmit } = useSpreadsheet(selectedDate);
  const [_, modalContextHolder] = useModal();
  const [popupMessage, messageContextHolder] = message.useMessage();

  const onSubmitClick = async () => {
    const result = await handleSubmit();
    if (!result) return;
    if (result.success) {
      popupMessage.success(result.message);
    } else {
      popupMessage.error(result.message);
    }
  };
  return (
    <div className="w-full">
      {messageContextHolder}
      {modalContextHolder}
      <Space direction="horizontal" size={16}>
        <Typography.Title level={3}>{selectedDate}の出勤表</Typography.Title>
        <ChangeSelectedMonthButton
          value={dayjs(selectedDate)}
          onChange={(value) => {
            setselectedDate(dayjs(value).format("YYYY-MM"));
          }}
        />
        <Typography.Title level={5}>
          ステータス：{attendStatus}
        </Typography.Title>
      </Space>
      <Space className="flex flex-col items-start">
        <div>
          <Button
            type="primary"
            disabled={attendStatus === "提出済"}
            onClick={onSubmitClick}
          >
            保存
          </Button>
        </div>
        <div ref={jssRef} />
      </Space>
    </div>
  );
};

export default AttendantManagePage;
