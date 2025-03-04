import { Button, DatePicker } from "antd";
import { useState } from "react";
import { ArrowDownOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
type ChangeSelectedMonthButtonProps = {
  onChange: (date: dayjs.Dayjs | null) => void;
  value: dayjs.Dayjs;
};
const ChangeSelectedMonthButton = ({
  onChange,
  value,
}: ChangeSelectedMonthButtonProps) => {
  const [open, setopen] = useState(false);

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setopen(true);
        }}
        size="small"
        icon={<ArrowDownOutlined />}
      ></Button>
      <DatePicker
        showNow={false}
        className="mb-3"
        style={{ visibility: "hidden", width: 0 }}
        open={open}
        onOpenChange={(open) => setopen(open)}
        onChange={(date) => onChange(date)}
        picker="month"
        value={value}
      />
    </>
  );
};

export default ChangeSelectedMonthButton;
