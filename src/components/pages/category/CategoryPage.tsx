"use client";
import styles from "./CategoryPage.module.scss";
import classNames from "classnames/bind";

import ProductCard from "@/components/productCard";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { getCategoryBySlug } from "@/services/category";
import { CATEGORY_BY_SLUG_QUERY_KEY } from "@/services/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { List, Typography } from "antd";
import { useParams } from "next/navigation";
import CustomBreadcrumb from "@/components/customBreadcrumb";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const CategoryPage = () => {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: [CATEGORY_BY_SLUG_QUERY_KEY],
    queryFn: async () => await getCategoryBySlug(slug as string),
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
