"use client";
import styles from "./SignUp.module.scss";
import classNames from "classnames/bind";

import {
  Button,
  Checkbox,
  DatePicker,
  Flex,
  Form,
  Image,
  Input,
  message,
  Radio,
  Space,
  Typography,
} from "antd";
import {
  LockOutlined,
  PhoneOutlined,
  LeftOutlined,
  MailOutlined,
  GlobalOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { LoginRequest } from "@/types/auth";
import { doCredentialLogin } from "@/actions/auth";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { SESSION_QUERY_KEY } from "@/services/queryKeys";
import PageWrapper from "@/components/wrapper/PageWrapper";
import Link from "next/link";
import { UserGender } from "@/constant/enum/userGender";

const cx = classNames.bind(styles);
const phoneNumberRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

const { Title, Text } = Typography;

export default function Login() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const redirect = searchParams.get("redirect") ?? "/";

  const mutation = useMutation({
    mutationFn: () => getSession(),
    onSuccess: (data) => {
      queryClient.setQueryData([SESSION_QUERY_KEY], data);
    },
  });

  const onFinish = async (values: LoginRequest) => {
    const formData = new FormData();
    formData.append("phoneNumber", values.phoneNumber);
    formData.append("password", values.password);
    try {
      setLoading(true);
      await doCredentialLogin(formData, redirect);
      mutation.mutate();
    } catch (error) {
      if (error instanceof Error) {
        messageApi.open({
          type: "error",
          content: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Flex align="center" justify="center" className={cx("container")}>
        <Flex className={cx("wrapper")}>
          <Flex vertical className={cx("wrapper-left")}>
            <Space direction="vertical">
              <Image
                src="./images/logo.png"
                alt="logo"
                preview={false}
                width={100}
                height={50}
              />
              <Title>Đăng ký tài khoản</Title>
            </Space>
            <Space className={cx("sign-up")}>
              <Text>Đã có tài khoản?</Text>
              <Link href="/login">Đăng nhập</Link>
            </Space>
          </Flex>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
            className={cx("form")}
          >
            <Flex vertical className={cx("form-section")}>
              <Form.Item
                validateStatus=""
                name="phoneNumber"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập số điện thoại!",
                  },
                  {
                    pattern: phoneNumberRegex,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Số điện thoại"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập mật khẩu!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Mật khẩu"
                  size="large"
                  autoComplete="on"
                />
              </Form.Item>
              <Form.Item
                name="password-confirm"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập lại mật khẩu!",
                  },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  size="large"
                  autoComplete="on"
                />
              </Form.Item>
              <Form.Item
                validateStatus=""
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập email!",
                  },
                  {
                    type: "email",
                    message: "Email không hợp lệ!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>
            </Flex>
            <Form.Item
              validateStatus=""
              name="firstName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ và tên đệm!",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Họ và tên đệm"
                size="large"
              />
            </Form.Item>
            <Form.Item
              validateStatus=""
              name="lastName"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên!",
                },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="Tên" size="large" />
            </Form.Item>
            <Form.Item
              validateStatus=""
              name="address"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ!",
                },
              ]}
            >
              <Input
                prefix={<GlobalOutlined />}
                placeholder="Địa chỉ"
                size="large"
              />
            </Form.Item>
            <Form.Item
              validateStatus=""
              name="dateOfBirth"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập ngày sinh!",
                },
              ]}
            >
              <DatePicker className={cx("date-of-birth")} size="large" />
            </Form.Item>
            <Form.Item
              validateStatus=""
              name="gender"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn giới tính!",
                },
              ]}
            >
              <Space>
                <Text strong>Giới tính</Text>
                <Radio.Group value={UserGender.MALE}>
                  <Radio value={UserGender.MALE}>Nam</Radio>
                  <Radio value={UserGender.FEMALE}>Nữ</Radio>
                </Radio.Group>
              </Space>
            </Form.Item>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button
                className={cx("submit-button")}
                block={true}
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Flex>
        {contextHolder}
      </Flex>
    </PageWrapper>
  );
}
