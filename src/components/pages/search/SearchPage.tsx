"use client";
import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { searchProductByName } from "@/services/product";
import { SEARCH_PRODUCT_BY_NAME_QUERY_KEY } from "@/services/queryKeys";
import { CloseCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { List, Space, Spin, Typography } from "antd";
import { useParams, useSearchParams } from "next/navigation";

const { Title, Text } = Typography;

const SearchPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const { data, isLoading, isError } = useQuery({
    queryKey: [SEARCH_PRODUCT_BY_NAME_QUERY_KEY, name],
    queryFn: async () => await searchProductByName(name ? name : ""),
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
        <Title level={3}>Kết quả tìm kiếm cho từ khóa &quot;{name}&quot;</Title>
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={data}
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

export default SearchPage;
