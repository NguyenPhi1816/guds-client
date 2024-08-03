"use client";
import styles from "./Login.module.scss";
import classNames from "classnames/bind";

import {
  Button,
  Checkbox,
  Flex,
  Form,
  Image,
  Input,
  message,
  Space,
  Typography,
} from "antd";
import { LockOutlined, PhoneOutlined, LeftOutlined } from "@ant-design/icons";
import { LoginRequest } from "@/types/auth";
import { doCredentialLogin } from "@/actions/auth";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getSession } from "next-auth/react";
import { SESSION_QUERY_KEY } from "@/services/queryKeys";
import PageWrapper from "@/components/wrapper/PageWrapper";
import Link from "next/link";
import { phoneNumberRegex } from "@/constant/regex/phoneNumber";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";

const cx = classNames.bind(styles);

const { Title, Text } = Typography;

export default function Login() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const message = useGlobalMessage();

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
        message.open({
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
        <Space className={cx("wrapper")} size={"large"}>
          <Image
            src="./images/logo.png"
            alt="logo"
            preview={false}
            width={100}
            height={50}
          />
          <Title>Đăng nhập</Title>
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
            className={cx("form")}
          >
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
            <Form.Item>
              <Flex justify="space-between">
                <Space>
                  <Checkbox checked></Checkbox>
                  <Text>Ghi nhớ đăng nhập</Text>
                </Space>
                <Space>
                  <Link href="/forgot-password">Quên mật khẩu</Link>
                </Space>
              </Flex>
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
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
          <Space className={cx("sign-up")}>
            <Text>Chưa có tài khoản?</Text>
            <Link href="/signup">Đăng ký</Link>
          </Space>
        </Space>
      </Flex>
    </PageWrapper>
  );
}
