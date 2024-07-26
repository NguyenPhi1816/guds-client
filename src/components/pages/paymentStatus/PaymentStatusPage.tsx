"use client";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Button, Flex, Space, Typography } from "antd";
import { useRouter, useSearchParams } from "next/navigation";

const { Title, Text } = Typography;

const SUCCESS = "success";
const FAILED = "failed";

const PaymentStatusPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  if (status === FAILED) {
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
              style={{ marginBottom: "1rem", fontSize: "3rem", color: "red" }}
            />
            <Title>Thanh toán thất bại</Title>
            <Text>
              Thanh toán đơn hàng không thành công. Có lỗi gì đó đã xảy ra
            </Text>
            <Space style={{ marginTop: "1rem" }}>
              <Button onClick={() => router.push("/")}>Về trang chủ</Button>
              <Button type="primary" onClick={() => router.push("/orders")}>
                Danh sách đơn hàng
              </Button>
            </Space>
          </Space>
        </Flex>
      </PageWrapper>
    );
  }

  if (status === SUCCESS) {
    return (
      <PageWrapper>
        <Flex
          justify="center"
          align="center"
          vertical
          style={{ marginTop: "8rem" }}
        >
          <Space direction="vertical" align="center">
            <CheckCircleOutlined
              style={{ marginBottom: "1rem", fontSize: "3rem", color: "green" }}
            />
            <Title>Thanh toán thành công</Title>
            <Text>Đơn hàng đã được thanh toán thành công</Text>
            <Space style={{ marginTop: "1rem" }}>
              <Button onClick={() => router.push("/")}>Về trang chủ</Button>
              <Button type="primary" onClick={() => router.push("/orders")}>
                Danh sách đơn hàng
              </Button>
            </Space>
          </Space>
        </Flex>
      </PageWrapper>
    );
  }

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
          <Title>Lỗi</Title>
          <Text>Có lỗi gì đó đã xảy ra</Text>
          <Space style={{ marginTop: "1rem" }}>
            <Button type="primary" onClick={() => router.push("/")}>
              Về trang chủ
            </Button>
          </Space>
        </Space>
      </Flex>
    </PageWrapper>
  );
};
export default PaymentStatusPage;
