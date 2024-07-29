"use client";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./ProductPage.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/services/product";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { Breadcrumb, Flex, Space, Spin, Typography } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import useMessage from "antd/es/message/useMessage";
import ProductInformation from "./components/productInformation";
import ProductCategory from "@/components/productCategory";
import ProductDescription from "./components/productDescription";
import ProductReview from "./components/productReview";
import { BASE_PRODUCT_QUERY_KEY } from "@/services/queryKeys";

const { Text } = Typography;

const cx = classNames.bind(styles);

const ProductPage = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const spid = searchParams.get("spid");

  const [loading, setLoading] = useState<boolean>(true);
  const [messageApi, contextHolder] = useMessage();

  const { data, isLoading, isError } = useQuery({
    queryKey: [BASE_PRODUCT_QUERY_KEY],
    queryFn: async () => await getProductBySlug(slug as string),
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timerId);
  }, []);

  if (isLoading || loading) {
    return (
      <PageWrapper
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin />
      </PageWrapper>
    );
  }

  if (isError) {
    messageApi.error("Có lỗi xảy ra trong quá trình tải dữ liệu");
  }

  return (
    slug &&
    spid &&
    data && (
      <PageWrapper>
        <Breadcrumb
          separator=">"
          items={[
            {
              title: (
                <Space>
                  <HomeOutlined className={cx("breadcrumb-title")} />
                  <Text className={cx("breadcrumb-title")}>Trang chủ</Text>
                </Space>
              ),
              href: "/",
            },
            ...data.categories.map((category) => ({
              title: (
                <Text className={cx("breadcrumb-title")}>{category.name}</Text>
              ),
              href: `/category/${category.slug}`,
            })),
            {
              title: data.name,
            },
          ]}
        />
        <ProductInformation data={data} spid={spid} />
        <ProductCategory
          title="Các sản phẩm liên quan"
          href={`/category/${data.categories[0].slug}`}
          data={data.relatedProducts}
        />
        <ProductDescription desc={data.description} />
        <ProductReview
          slug={slug as string}
          averageRating={data.averageRating}
        />
        {contextHolder}
      </PageWrapper>
    )
  );
};

export default ProductPage;
