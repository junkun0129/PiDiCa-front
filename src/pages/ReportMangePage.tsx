import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { appRoute } from "../const";

const ReportMangePage = () => {
  const navigate = useNavigate();
  const onclick = () => {
    navigate("/" + appRoute.reportRegister);
  };
  return (
    <div>
      <Button onClick={onclick}>日報作成画面</Button>
    </div>
  );
};

export default ReportMangePage;
