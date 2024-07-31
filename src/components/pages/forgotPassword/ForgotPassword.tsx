"use client";

import styles from "./ForgotPassword.module.scss";
import classNames from "classnames/bind";
import { Button, Flex, Form, Input, Typography } from "antd";
import { phoneNumberRegex } from "@/constant/regex/phoneNumber";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { sendOtp } from "@/services/otp";
import { OtpType } from "@/constant/enum/otpType";
import useMessage from "antd/es/message/useMessage";
import { useState } from "react";
import PageWrapper from "@/components/wrapper/PageWrapper";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const ForgotPassword = () => {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [messageApi, contextHolder] = useMessage();

  const mutation = useMutation({
    mutationFn: (phoneNumber: string) => sendOtp(phoneNumber),
    onSuccess: () =>
      router.push(
        `/verify-otp?type=${OtpType.FORGOT_PASSWORD}&phoneNumber=${phoneNumber}`
      ),
    onError: (error) => messageApi.error(error.message),
  });

  const handleFinish = (value: { phoneNumber: string }) => {
    setPhoneNumber(value.phoneNumber);
    mutation.mutate(value.phoneNumber);
  };

  return (
    <PageWrapper>
      <Flex justify="center" align="center" className={cx("wrapper")}>
        <Flex vertical className={cx("container")}>
          <Title className={cx("title")}>Nhập số điện thoại</Title>
          <Text className={cx("text")}>
            Vui lòng nhập số điện thoại mà bạn đã đăng ký. Chúng tôi sẽ gửi một
            mã OTP thông qua email của bạn.
          </Text>
          <Form onFinish={handleFinish}>
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
              <Flex justify="center">
                <Input size="large" placeholder="Nhập số điện thoại..." />
              </Flex>
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                htmlType="submit"
                className={cx("btn")}
              >
                Tiếp tục
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Flex>
      {contextHolder}
    </PageWrapper>
  );
};

export default ForgotPassword;
