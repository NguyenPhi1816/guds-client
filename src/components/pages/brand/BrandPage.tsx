"use client";

import styles from "./BrandPage.module.scss";
import classNames from "classnames/bind";

import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getBrandBySlug } from "@/services/brand";
import { BRAND_BY_SLUG_QUERY_KEY } from "@/services/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { List, Typography } from "antd";
import { useParams } from "next/navigation";
import CustomBreadcrumb from "@/components/customBreadcrumb";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage/ErrorPage";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const CategoryPage = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: [BRAND_BY_SLUG_QUERY_KEY],
    queryFn: async () => await getBrandBySlug(slug as string),
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
        <CustomBreadcrumb currentPageName={data.name} />
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
