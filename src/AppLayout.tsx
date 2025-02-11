import { Card, Layout, Menu, MenuProps } from "antd";
import Sider from "antd/es/layout/Sider";
import { appRoute, appStyle, COOKIES } from "./const";
import { Content } from "antd/es/layout/layout";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCookie } from "./helpers/util";

const {
  reportManage,
  taskManage,
  projectManage,
  userManage,
  attendManage,
  setting,
} = appRoute;

const AppLayout = () => {
  const navigate = useNavigate();
  const isSigned = getCookie(COOKIES.isLoggedin);
  if (!isSigned) {
    navigate("/signin");
  }
  const menuItems: MenuProps["items"] = [
    { key: reportManage, label: "日報管理" },
    { key: taskManage, label: "タスク管理" },
    { key: projectManage, label: "プロジェクト管理" },
    { key: userManage, label: "ユーザー管理" },
    { key: attendManage, label: "勤怠管理" },
    { key: setting, label: "設定" },
  ];

  const [selectedKey, setselectedKey] = useState(reportManage);

  const location = useLocation();

  useEffect(() => {
    console.log(location.pathname);
    const path = location.pathname.replace("/", "");
    setselectedKey(path);
  }, [location]);

  const onItemClick = (key: string) => {
    navigate(key);
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider
        className="flex justify-center items-center relative"
        width={appStyle.siderWidth}
        trigger={null}
        collapsible
      >
        <div className=" text-white text-3xl my-4 ml-4 flex relative">
          PiDiCA
        </div>
        <Menu
          onClick={({ key }) => onItemClick(key)}
          items={menuItems}
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          activeKey={selectedKey}
        ></Menu>
      </Sider>
      <Content>
        <Card className="m-4 h-[95vh] shadow-lg">
          <Outlet></Outlet>
        </Card>
      </Content>
    </Layout>
  );
};

export default AppLayout;
