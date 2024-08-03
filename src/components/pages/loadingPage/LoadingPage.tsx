import PageWrapper from "@/components/wrapper/PageWrapper";
import { Space, Spin, Typography } from "antd";

const { Text } = Typography;

const LoadingPage = () => {
  return (
    <PageWrapper
      style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Space direction="vertical" align="center" size={"large"}>
        <Spin />
        <Text>Đang tải dữ liệu</Text>
      </Space>
    </PageWrapper>
  );
};

export default LoadingPage;
