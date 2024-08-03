"use client";

import PageWrapper from "@/components/wrapper/PageWrapper";
import { CloseCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";

const { Title, Text } = Typography;

const ErrorPage = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleRefreshPage = () => {
    if (pathname === "/error") {
      return router.push("/");
    }
    return router.refresh();
  };

  return (
    <PageWrapper>
      <Flex
        justify="center"
        align="center"
        vertical
        style={{ marginTop: "8rem" }}
      >
        <Space direction="vertical" align="center">
          <CloseCircleOutlined
            style={{ marginBottom: "2rem", fontSize: "3rem", color: "red" }}
          />
          <Title>Có lỗi đã xảy ra</Title>
          <Text>Có lỗi gì đó đã xảy ra</Text>
          <Space style={{ marginTop: "1rem" }}>
            <Button type="primary" onClick={handleRefreshPage}>
              Tải lại
            </Button>
          </Space>
        </Space>
      </Flex>
    </PageWrapper>
  );
};

export default ErrorPage;
