"use client";
import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { searchProductByName } from "@/services/product";
import { SEARCH_PRODUCT_BY_NAME_QUERY_KEY } from "@/services/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { List, Typography } from "antd";
import { useSearchParams } from "next/navigation";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";

const { Title } = Typography;

const SearchPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const { data, isLoading, isError } = useQuery({
    queryKey: [SEARCH_PRODUCT_BY_NAME_QUERY_KEY, name],
    queryFn: async () => await searchProductByName(name ? name : ""),
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (data) {
    return (
      <PageWrapper>
        <Title level={3}>
          Kết quả tìm kiếm cho từ khóa &quot;{name === "_" ? "" : name}&quot;
        </Title>
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
