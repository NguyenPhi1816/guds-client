"use client";
import styles from "./SignUp.module.scss";
import classNames from "classnames/bind";

import {
  Button,
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
import { SignUpRequest, SignUpResponse } from "@/types/auth";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import PageWrapper from "@/components/wrapper/PageWrapper";
import Link from "next/link";
import { UserGender } from "@/constant/enum/userGender";
import FormAddress from "@/components/form/address/FormAddress";
import { signUp } from "@/services/auth";
import { useRouter } from "next/navigation";
import { phoneNumberRegex } from "@/constant/regex/phoneNumber";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";

const cx = classNames.bind(styles);

const { Title, Text } = Typography;

export default function Login() {
  const router = useRouter();
  const [address, setAddress] = useState<string>("");
  const message = useGlobalMessage();

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GUDS_API}/recommend-products`
      );
      const profile = await res.json();
      console.log(profile);
    };
    fetcher();
  }, []);

  const signUpMutation = useMutation({
    mutationFn: (request: SignUpRequest) => signUp(request),
    onSuccess: async (data: SignUpResponse) => {
      message.success(data.message);
      setTimeout(() => router.push("/login"), 2000);
    },
    onError: (error) => message.error(error.message),
  });

  const onFinish = async (values: any) => {
    const request: SignUpRequest = {
      email: values.email,
      address: address,
      dateOfBirth: values.dateOfBirth.format("YYYY-MM-DD"),
      firstName: values.firstName,
      gender: values.gender,
      lastName: values.lastName,
      password: values.password,
      phoneNumber: values.phoneNumber,
    };
    signUpMutation.mutate(request);
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
            initialValues={{
              gender: UserGender.MALE,
            }}
            validateMessages={{
              required: "${label} là bắt buộc!",
              types: {
                email: "${label} không hợp lệ!",
              },
            }}
          >
            <Flex className={cx("form-wrapper")}>
              <Flex className={cx("form-section")} vertical>
                <Form.Item
                  label="Họ và tên đệm"
                  name="firstName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ và tên đệm!",
                    },
                  ]}
                >
                  <Input placeholder="Họ và tên đệm" size="large" />
                </Form.Item>
                <Form.Item
                  label="Tên"
                  name="lastName"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên!",
                    },
                  ]}
                >
                  <Input placeholder="Tên" size="large" />
                </Form.Item>
                <Form.Item
                  label="Số điện thoại"
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
                  <Input placeholder="Số điện thoại" size="large" />
                </Form.Item>
                <Form.Item
                  label="Email"
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
                  <Input placeholder="Email" size="large" />
                </Form.Item>
                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập mật khẩu!",
                    },
                  ]}
                >
                  <Input.Password
                    type="password"
                    placeholder="Mật khẩu"
                    size="large"
                    autoComplete="on"
                  />
                </Form.Item>
                <Form.Item
                  label="Nhập lại mật khẩu"
                  name="password-confirm"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập lại mật khẩu!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu không khớp!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    type="password"
                    placeholder="Nhập lại mật khẩu"
                    size="large"
                    autoComplete="on"
                  />
                </Form.Item>
              </Flex>
              <Flex className={cx("form-section")} vertical>
                <FormAddress onChange={(address) => setAddress(address)} />
                <Form.Item
                  label="Ngày sinh"
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
                  label="Giới tính"
                  name="gender"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn giới tính!",
                    },
                  ]}
                >
                  <Radio.Group value={UserGender.MALE}>
                    <Radio value={UserGender.MALE}>Nam</Radio>
                    <Radio value={UserGender.FEMALE}>Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Flex>
            </Flex>
            <Form.Item style={{ marginBottom: "0px" }}>
              <Button
                className={cx("submit-button")}
                block={true}
                type="primary"
                htmlType="submit"
                size="large"
                loading={signUpMutation.isPending}
              >
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
    </PageWrapper>
  );
}
