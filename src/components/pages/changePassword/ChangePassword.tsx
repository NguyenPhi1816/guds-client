"use client";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { updatePasswordByPhoneNumber } from "@/services/auth";
import { SuccessResponse } from "@/types/sucess";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Typography } from "antd";
import useMessage from "antd/es/message/useMessage";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const { Title } = Typography;

const ChangePassword = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const message = useGlobalMessage();

  const updateMutation = useMutation({
    mutationFn: async (params: { phoneNumber: string; newPassword: string }) =>
      await updatePasswordByPhoneNumber(params.phoneNumber, params.newPassword),
    onSuccess: (data: SuccessResponse) => {
      message.success(data.message);
      router.push("/login");
    },
    onError: (error) => message.error(error.message),
  });

  const onFinish = (values: any) => {
    const phoneNumber = searchParams.get("phoneNumber");
    if (phoneNumber) {
      updateMutation.mutate({
        phoneNumber: phoneNumber,
        newPassword: values.newPassword,
      });
    }
  };

  return (
    <PageWrapper>
      <div
        style={{
          paddingTop: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Title>Thay đổi mật khẩu</Title>
        <Form
          form={form}
          layout="vertical"
          style={{ width: "35%" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" size="large" />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu mới"
            name="newPasswordConfirm"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu mới",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu mới không khớp"));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu mới" size="large" />
          </Form.Item>
          <Form.Item>
            <Button
              block={true}
              type="primary"
              htmlType="submit"
              size="large"
              loading={updateMutation.isPending}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </div>
    </PageWrapper>
  );
};

export default ChangePassword;
