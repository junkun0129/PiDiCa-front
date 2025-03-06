import { Menu, Space } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../../providers/AppContextProvider";
import { MenuProps } from "antd";
import { appRoute } from "../../const";
import Sider from "antd/es/layout/Sider";
import {
  FileTextOutlined,
  ProjectOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  SettingOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";

import logoimg from "../../assets/pidica_logo.svg";

const {
  reportManage,
  taskManage,
  projectManage,
  userManage,
  attendManage,
  setting,
} = appRoute;

const AppSider = () => {
  const menuItems: MenuProps["items"] = [
    {
      key: reportManage,
      label: "日報管理",
      icon: <FileTextOutlined />,
    },
    {
      key: taskManage,
      label: "タスク管理",
      icon: <CheckSquareOutlined />,
    },
    {
      key: projectManage,
      label: "プロジェクト管理",
      icon: <ProjectOutlined />,
    },
    {
      key: userManage,
      label: "ユーザー管理",
      icon: <TeamOutlined />,
    },
    {
      key: attendManage,
      label: "勤怠管理",
      icon: <ClockCircleOutlined />,
    },
    {
      key: setting,
      label: "設定",
      icon: <SettingOutlined />,
    },
  ];

  const [selectedKey, setselectedKey] = useState(reportManage);
  const { isSidebarOpen } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.replace("/", "");
    setselectedKey(path);
  }, [location]);

  const onItemClick = (key: string) => {
    navigate(key);
  };

  return (
    <Sider
      width={isSidebarOpen ? 200 : 80}
      trigger={null}
      collapsible
      theme="light"
      collapsed={!isSidebarOpen}
      className="h-screen shadow-lg"
    >
      <div
        className={`flex justify-center items-center h-16  text-xl ${
          !isSidebarOpen ? "px-4" : "px-6"
        }`}
      >
        {isSidebarOpen ? (
          <Space className="flex -ml-14">
            <div
              className="w-[35px] h-[35px] bg-cover"
              style={{ backgroundImage: `url(${logoimg})` }}
            ></div>
            <div>PiDiCA</div>
          </Space>
        ) : (
          <div
            className="w-[35px] h-[35px] bg-cover"
            style={{ backgroundImage: `url(${logoimg})` }}
          ></div>
        )}
      </div>
      <Menu
        onClick={({ key }) => onItemClick(key)}
        items={menuItems}
        mode="inline"
        selectedKeys={[selectedKey]}
        activeKey={selectedKey}
        theme="light"
      />
    </Sider>
  );
};

export default AppSider;
