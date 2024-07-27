"use client";
import styles from "./CategoryPage.module.scss";
import classNames from "classnames/bind";

import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getCategoryBySlug } from "@/services/category";
import { CATEGORY_BY_SLUG_QUERY_KEY } from "@/services/queryKeys";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { List, Space, Spin, Typography } from "antd";
import { useParams } from "next/navigation";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const CategoryPage = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: [CATEGORY_BY_SLUG_QUERY_KEY],
    queryFn: async () => await getCategoryBySlug(slug as string),
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
        <Title>{data.name}</Title>
        <Text style={{ color: "var(--grey)" }}>{data.description}</Text>
        <Title level={3}>Sản phẩm trong danh mục {data.name}</Title>
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
