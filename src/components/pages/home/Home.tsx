"use client";
import HomeCarousel from "@/components/carousel/HomeCarousel";
import ProductCategory from "@/components/productCategory/ProductCategory";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category";
import PageWrapper from "@/components/wrapper/PageWrapper";
import {
  BLOGS_QUERY_KEY,
  CATEGORIES_QUERY_KEY,
  RECOMMENDATION_QUERY_KEY,
} from "@/services/queryKeys";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";
import { getTopBlogs } from "@/services/blog";
import BlogCategory from "@/components/blog/BlogCategory";
import { getRecommendProduct } from "@/services/product";

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getAllCategories(),
    queryKey: [CATEGORIES_QUERY_KEY],
  });

  const {
    data: blogs,
    isLoading: blogsLoading,
    isError: blogsError,
  } = useQuery({
    queryFn: async () => await getTopBlogs(),
    queryKey: [BLOGS_QUERY_KEY],
  });

  const {
    data: recommendProducts,
    isLoading: recommendLoading,
    isError: recommendError,
  } = useQuery({
    queryFn: async () => await getRecommendProduct(),
    queryKey: [RECOMMENDATION_QUERY_KEY],
  });

  if (isLoading && blogsLoading && recommendLoading) {
    return <LoadingPage />;
  }

  if (isError || blogsError || recommendError) {
    return <ErrorPage />;
  }

  if (data && recommendProducts) {
    return (
      <PageWrapper>
        <HomeCarousel />

        {recommendProducts && (
          <ProductCategory
            key={-1}
            title={"Sản phẩm gợi ý cho bạn"}
            href={`/`}
            data={recommendProducts}
          />
        )}

        {/* <div style={{ marginTop: "2rem" }}>
          {data &&
            data.map(
              (category) =>
                category.products.length > 0 && (
                  <ProductCategory
                    key={category.id}
                    title={"Danh mục " + category.name}
                    href={`/category/${category.slug}`}
                    data={category.products}
                  />
                )
            )}
        </div>
        <div style={{ marginTop: "2rem" }}>
          {blogs && (
            <BlogCategory
              data={blogs}
              href="/blogs"
              title="Bài viết mới nhất"
            />
          )}
        </div> */}
      </PageWrapper>
    );
  }
};

export default HomePage;
