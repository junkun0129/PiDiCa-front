import { MenuUnfoldOutlined } from "@ant-design/icons";
import { MenuFoldOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import React from "react";
import { useAppContext } from "../../providers/AppContextProvider";
import { Button } from "antd";

const AppHeader = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();
  return (
    <Header className="bg-transparent h-[40px] flex items-center px-0">
      <Button
        type="text"
        icon={isSidebarOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className=""
      />
    </Header>
  );
};

export default AppHeader;
