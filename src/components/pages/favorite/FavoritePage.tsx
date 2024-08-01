"use client";

import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getFavoriteProducts } from "@/services/cookie";
import { FAVORITE_PRODUCT_QUERY_KEY } from "@/services/queryKeys";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { List, Space, Spin, Typography } from "antd";

const { Title, Text } = Typography;

const FavoritePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getFavoriteProducts(),
    queryKey: [FAVORITE_PRODUCT_QUERY_KEY],
  });

  if (isLoading) {
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
  }

  if (isError) {
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
          <CloseCircleOutlined style={{ fontSize: "3rem", color: "red" }} />
          <Text>Có lỗi xảy ra trong quá trình tải dữ liệu</Text>
        </Space>
      </PageWrapper>
    );
  }

  if (data) {
    return (
      <PageWrapper>
        <Title>Danh sách sản phẩm yêu thích</Title>
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={data.data}
          renderItem={(item) => (
            <List.Item>
              <ProductCard product={item} />
            </List.Item>
          )}
        />
      </PageWrapper>
    );
  }
};

export default FavoritePage;
