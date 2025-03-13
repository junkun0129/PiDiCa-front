import { ConfigProvider } from "antd";
import { ReactNode } from "react";
type AntdProviderProps = {
  children: ReactNode;
};
const AntdProvider = ({ children }: AntdProviderProps) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "noto",
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default AntdProvider;
