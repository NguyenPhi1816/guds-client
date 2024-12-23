"use client";
import styles from "./CategoryPage.module.scss";
import classNames from "classnames/bind";

import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import {
  getBaseProductByCategorySlug,
  getCategoryBySlug,
} from "@/services/category";
import { CATEGORY_BY_SLUG_QUERY_KEY } from "@/services/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { Flex, List, Typography } from "antd";
import { useParams } from "next/navigation";
import CustomBreadcrumb from "@/components/customBreadcrumb";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";
import { useEffect, useState } from "react";
import { OrderBySearchParams } from "@/constant/enum/orderBySearchParams";
import ProductFilter from "@/components/productFilter";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const CategoryPage = () => {
  const { slug } = useParams();
  const [fromPrice, setFromPrice] = useState<number | undefined>(undefined);
  const [toPrice, setToPrice] = useState<number | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<string>(
    OrderBySearchParams.BEST_SELLING
  );
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const { data, isLoading, isError } = useQuery({
    queryKey: [CATEGORY_BY_SLUG_QUERY_KEY, slug],
    queryFn: async () =>
      await getCategoryBySlug(
        slug as string,
        orderBy,
        page,
        pageSize,
        fromPrice,
        toPrice
      ),
  });

  const {
    data: products,
    isLoading: productsLoading,
    isError: productsError,
    refetch,
  } = useQuery({
    queryKey: [slug, orderBy, page, pageSize, fromPrice, toPrice],
    queryFn: async () =>
      await getBaseProductByCategorySlug(
        slug as string,
        orderBy,
        page,
        pageSize,
        fromPrice,
        toPrice
      ),
    enabled: false,
  });

  useEffect(() => {
    if (slug) {
      refetch();
    }
  }, [slug, orderBy, page, pageSize, fromPrice, toPrice]);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError || productsError) {
    return <ErrorPage />;
  }

  if (data) {
    return (
      <PageWrapper>
        <CustomBreadcrumb
          currentPageName={data.name}
          parentPages={
            data.parent
              ? [
                  {
                    href: `/category/${data.parent.slug}`,
                    name: data.parent.name,
                  },
                ]
              : []
          }
        />
        <Title level={3}>Sản phẩm trong danh mục {data.name}</Title>
        <Flex style={{ padding: "0 1rem", textAlign: "justify" }}>
          <Text style={{ color: "var(--grey)" }}>{data.description}</Text>
        </Flex>
        <ProductFilter
          orderBy={orderBy}
          onOrderByChange={(value) => setOrderBy(value)}
          onPriceRangeChange={(fromPrice, toPrice) => {
            setFromPrice(fromPrice);
            setToPrice(toPrice);
          }}
        />
        {!productsLoading && data && products ? (
          <List
            grid={{ gutter: 16, column: 5 }}
            dataSource={products ? products : data.products}
            renderItem={(item) => (
              <List.Item>
                <ProductCard product={item} />
              </List.Item>
            )}
            pagination={{
              pageSize: pageSize,
              total: data.products.length,
              onChange: (page) => setPage(page),
              onShowSizeChange: (current, number) => {
                setPageSize(number);
              },
            }}
          />
        ) : (
          <LoadingPage />
        )}
      </PageWrapper>
    );
  }
};

export default CategoryPage;
