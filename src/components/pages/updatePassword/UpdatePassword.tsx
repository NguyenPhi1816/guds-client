"use client";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { updatePassword } from "@/services/auth";
import { SuccessResponse } from "@/types/sucess";
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, Typography } from "antd";
import useMessage from "antd/es/message/useMessage";
import { error } from "console";
import { useState } from "react";

const { Title } = Typography;

const UpdatePassword = () => {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = useMessage();

  const updateMutation = useMutation({
    mutationFn: async (params: { oldPassword: string; newPassword: string }) =>
      await updatePassword(params.oldPassword, params.newPassword),
    onSuccess: (data: SuccessResponse) => messageApi.success(data.message),
    onError: (error) => messageApi.error(error.message),
  });

  const onFinish = (values: any) => {
    updateMutation.mutate({
      oldPassword: values.oldPassword,
      newPassword: values.newPassword,
    });
  };

  return (
    <PageWrapper>
      <Title>Thay đổi mật khẩu</Title>
      <div
        style={{
          paddingTop: "4rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: "35%" }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="oldPassword"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu cũ",
              },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu cũ" size="large" />
          </Form.Item>
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
              Lưu thông tin
            </Button>
          </Form.Item>
        </Form>
      </div>
      {contextHolder}
    </PageWrapper>
  );
};

export default UpdatePassword;
