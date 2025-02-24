import React, { useState } from "react";
import AttendSpreadSheet from "../components/displays/AttendSpreadSheet";
import { Button, DatePicker, message, Space, Typography } from "antd";
import dayjs from "dayjs";
import useSpreadsheet from "../hooks/useSpreadSheet";
import useModal from "antd/es/modal/useModal";
const AttendantManagePage = () => {
  const [selectedDate, setselectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM")
  );

  const { jssRef, attendStatus, handleSubmit } = useSpreadsheet(selectedDate);
  const [modal, modalContextHolder] = useModal();
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
    <div>
      <Space direction="horizontal" size={16}>
        <Typography.Title level={5}>出勤表</Typography.Title>
        <DatePicker
          picker="month"
          value={dayjs(selectedDate)}
          onChange={(value) => {
            setselectedDate(dayjs(value).format("YYYY-MM"));
          }}
        />
      </Space>
      {messageContextHolder}
      {modalContextHolder}
      <div>
        <Space direction="horizontal" size={16}>
          <div>{attendStatus}</div>
          <Button disabled={attendStatus === "提出済"} onClick={onSubmitClick}>
            保存
          </Button>
        </Space>
        <div ref={jssRef} />
      </div>
    </div>
  );
};

export default AttendantManagePage;
