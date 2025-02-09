import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../helpers/util";
import { signinApi } from "../api/auth.api";
import { appRoute, COOKIES } from "../const";

interface LoginFormData {
  username: string;
  password: string;
  remember: boolean;
}

const SigninPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormData) => {
    try {
      setLoading(true);
      // API call would go here
      const response = await signinApi({
        email: values.username,
        password: values.password,
      });
      if (response.result === "failed") {
        throw new Error("Login failed!");
      }
      setCookie(COOKIES.token, response.data.token);
      setCookie(COOKIES.email, response.data.user.email);
      setCookie(COOKIES.cd, response.data.user.cd);
      setCookie(COOKIES.name, response.data.user.username);
      setCookie(COOKIES.isLoggedin, "true");
      message.success("Login successful!");
      navigate(appRoute.reportManage);
    } catch (error) {
      message.error("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-8">Login to PDCAce</h1>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username or Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-between">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a className="text-blue-600" href="/forgot-password">
                Forgot password?
              </a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>

          <div className="text-center">
            Don't have an account?{" "}
            <a className="text-blue-600" onClick={() => navigate("/signup")}>
              Sign up now
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SigninPage;
