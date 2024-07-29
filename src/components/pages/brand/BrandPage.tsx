"use client";

import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getBrandBySlug } from "@/services/brand";
import { getCategoryBySlug } from "@/services/category";
import {
  BRAND_BY_SLUG_QUERY_KEY,
  CATEGORY_BY_SLUG_QUERY_KEY,
} from "@/services/queryKeys";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { List, Space, Spin, Typography } from "antd";
import { useParams } from "next/navigation";

const { Title, Text } = Typography;

const CategoryPage = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: [BRAND_BY_SLUG_QUERY_KEY],
    queryFn: async () => await getBrandBySlug(slug as string),
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
        <Title>Các sản phẩm đến từ {data.name}</Title>
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={data.products}
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

export default CategoryPage;
