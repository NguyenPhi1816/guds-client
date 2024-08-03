"use client";

import { useEffect, useState } from "react";
import styles from "./VerifyOTP.module.scss";
import classNames from "classnames/bind";

import { useSearchParams } from "next/navigation";
import PageWrapper from "../wrapper/PageWrapper";
import { Button, Flex, Form, GetProps, Input, Typography } from "antd";
import Link from "next/link";
import useMessage from "antd/es/message/useMessage";
import { useMutation } from "@tanstack/react-query";
import { SuccessResponse } from "@/types/sucess";
import { sendOtp, verifyOtp } from "@/services/otp";
import { useRouter } from "next/navigation";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";

type OTPProps = GetProps<typeof Input.OTP>;

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const VerifyOTP = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const phoneNumber = searchParams.get("phoneNumber");

  const [otp, setOtp] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const message = useGlobalMessage();

  const reSendOtpMutation = useMutation({
    mutationFn: (phoneNumber: string) => sendOtp(phoneNumber),
    onSuccess: (data: SuccessResponse) => {
      message.success(data.message);
      setCountdown(60);
    },
    onError: (error) => message.error(error.message),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (params: { phoneNumber: string; otp: string }) =>
      verifyOtp(params.phoneNumber, params.otp),
    onSuccess: (data: SuccessResponse) => {
      message.success(data.message);
      router.push(`/change-password?phoneNumber=${phoneNumber}`);
    },
    onError: (error) => message.error(error.message),
  });

  useEffect(() => {
    if (countdown === 0) {
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleResendOtp = () => {
    if (phoneNumber) {
      reSendOtpMutation.mutate(phoneNumber);
    } else {
      message.error("Có lỗi xảy ra");
    }
  };

  const onChange: OTPProps["onChange"] = (text) => {
    setOtp(text);
  };

  const sharedProps: OTPProps = {
    onChange,
  };

  const handleSubmit = () => {
    if (!phoneNumber) {
      return message.error("Có lỗi xảy ra");
    }

    if (!otp) {
      return message.error("Vui lòng nhập OTP");
    }

    verifyOtpMutation.mutate({ phoneNumber, otp });
  };

  return (
    <PageWrapper>
      <Flex justify="center" align="center" className={cx("wrapper")}>
        <Flex vertical className={cx("container")}>
          <Title className={cx("title")}>Xác thực mã OTP</Title>
          <Text className={cx("text")}>
            Chúng tôi vừa gửi một mã OTP qua email của bạn. Vui lòng nhập OTP để
            tiếp tục
          </Text>
          <Form>
            <Form.Item name="otp">
              <Flex justify="center">
                <Input.OTP size="large" length={6} {...sharedProps} />
              </Flex>
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                type="primary"
                className={cx("btn")}
                onClick={handleSubmit}
              >
                Xác minh
              </Button>
            </Form.Item>
          </Form>
          <Flex align="center" justify="space-between">
            {countdown === 0 ? (
              <Text className={cx("countdown-danger")}>Mã đã hết hạn</Text>
            ) : (
              <Text className={cx("countdown")}>
                Mã có hiệu lực trong {countdown}s
              </Text>
            )}

            <Button
              onClick={handleResendOtp}
              type="text"
              className={cx("btn-resend")}
              loading={reSendOtpMutation.isPending}
            >
              Gửi lại mã
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </PageWrapper>
  );
};

export default VerifyOTP;
