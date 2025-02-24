import React from "react";
import { Button, Space, message } from "antd";
import useSpreadsheet from "../../hooks/useSpreadSheet";
import useModal from "antd/es/modal/useModal";

const AttendSpreadSheet = ({ selectedDate }: { selectedDate: string }) => {
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
    <>
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
    </>
  );
};

export default AttendSpreadSheet;
