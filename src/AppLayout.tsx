import { Card, Layout } from "antd";

import { COOKIES } from "./const";
import { Content } from "antd/es/layout/layout";
import { Outlet, useNavigate } from "react-router-dom";

import { getCookie } from "./helpers/util";
import AppHeader from "./components/layouts/AppHeader";
import AppSider from "./components/layouts/AppSider";
import { useEffect } from "react";

const AppLayout = () => {
  const navigate = useNavigate();
  const isSigned = getCookie(COOKIES.isLoggedin);
  useEffect(() => {
    if (!isSigned) {
      navigate("/signin");
    }
  }, []);

  return (
    <Layout className="h-screen w-full overflow-hidden">
      <AppSider />
      <Content className="flex w-full flex-col min-h-0 px-4">
        <AppHeader />
        <Card className="flex-1 w-full rounded-lg border-0 shadow-lg overflow-auto">
          <Outlet></Outlet>
        </Card>
      </Content>
    </Layout>
  );
};

export default AppLayout;
