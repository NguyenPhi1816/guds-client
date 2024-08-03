"use client";
import { useParams, useSearchParams } from "next/navigation";
import styles from "./ProductPage.module.scss";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProductBySlug } from "@/services/product";
import PageWrapper from "@/components/wrapper/PageWrapper";
import ProductInformation from "./components/productInformation";
import ProductCategory from "@/components/productCategory";
import ProductDescription from "./components/productDescription";
import ProductReview from "./components/productReview";
import { BASE_PRODUCT_QUERY_KEY } from "@/services/queryKeys";
import CustomBreadcrumb from "@/components/customBreadcrumb";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";

const cx = classNames.bind(styles);

const ProductPage = () => {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const spid = searchParams.get("spid");

  const [loading, setLoading] = useState<boolean>(true);

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
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (slug && spid && data) {
    return (
      <PageWrapper>
        <CustomBreadcrumb
          currentPageName={data.name}
          parentPages={data.categories.map((category) => ({
            href: `/category/${category.slug}`,
            name: category.name,
          }))}
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
      </PageWrapper>
    );
  }
};

export default ProductPage;
