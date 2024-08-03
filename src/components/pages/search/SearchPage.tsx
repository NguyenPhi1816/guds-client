"use client";
import React, { useState } from "react";
import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { searchProductByName } from "@/services/product";
import { SEARCH_PRODUCT_BY_NAME_QUERY_KEY } from "@/services/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { List, Typography } from "antd";
import { useSearchParams } from "next/navigation";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";
import { OrderBySearchParams } from "@/constant/enum/orderBySearchParams";
import ProductFilter from "@/components/productFilter";

const { Title } = Typography;

const SearchPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [fromPrice, setFromPrice] = useState<number | undefined>(undefined);
  const [toPrice, setToPrice] = useState<number | undefined>(undefined);
  const [orderBy, setOrderBy] = useState<string>(
    OrderBySearchParams.BEST_SELLING
  );
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      SEARCH_PRODUCT_BY_NAME_QUERY_KEY,
      name,
      fromPrice,
      toPrice,
      orderBy,
      page,
      pageSize,
    ],
    queryFn: async () =>
      await searchProductByName(
        name ? name : "",
        orderBy,
        page,
        pageSize,
        fromPrice,
        toPrice
      ),
  });

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <PageWrapper>
      <Title level={3}>
        Kết quả tìm kiếm cho từ khóa &quot;{name === "_" ? "" : name}&quot;
      </Title>
      <ProductFilter
        fromPrice={fromPrice}
        toPrice={toPrice}
        orderBy={orderBy}
        onFromPriceChange={(value) => setFromPrice(value)}
        onToPriceChange={(value) => setToPrice(value)}
        onOrderByChange={(value) => setOrderBy(value)}
      />
      {!isLoading && data ? (
        <List
          grid={{ gutter: 16, column: 5 }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <ProductCard product={item} />
            </List.Item>
          )}
          pagination={{
            pageSize: pageSize,
            total: data.length,
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
};

export default SearchPage;
