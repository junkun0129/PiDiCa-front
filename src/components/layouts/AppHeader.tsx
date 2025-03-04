import {
  BellOutlined,
  LogoutOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { MenuFoldOutlined } from "@ant-design/icons";
import { Header } from "antd/es/layout/layout";
import { useAppContext } from "../../providers/AppContextProvider";
import { Avatar, Button, Space } from "antd";
import { getCookie } from "../../helpers/util";
import { COOKIES } from "../../const";

const AppHeader = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();
  const user_name = getCookie(COOKIES.name);
  const user_initial = user_name ? user_name[0] : "";
  return (
    <Header className="bg-transparent h-[40px] flex items-center px-0 justify-between">
      <Button
        type="text"
        icon={isSidebarOpen ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className=""
      />
      <Space>
        <Button
          className="rounded-full"
          type="text"
          icon={<BellOutlined />}
        ></Button>
        <Button
          className="rounded-full"
          type="text"
          icon={<LogoutOutlined />}
        ></Button>
        <Avatar className="mb-1" size={"small"}>
          {user_initial}
        </Avatar>
        <div>{user_name || ""}</div>
      </Space>
    </Header>
  );
};

export default AppHeader;
