"use client";

import CustomBreadcrumb from "@/components/customBreadcrumb";
import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getFavoriteProducts } from "@/services/cookie";
import { FAVORITE_PRODUCT_QUERY_KEY } from "@/services/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { List, Typography } from "antd";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";

const { Title } = Typography;

const FavoritePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getFavoriteProducts(),
    queryKey: [FAVORITE_PRODUCT_QUERY_KEY],
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
        <CustomBreadcrumb currentPageName="Sản phẩm yêu thích" />
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
