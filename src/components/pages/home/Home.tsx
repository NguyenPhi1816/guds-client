"use client";
import HomeCarousel from "@/components/carousel/HomeCarousel";
import ProductCategory from "@/components/productCategory/ProductCategory";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { CATEGORIES_QUERY_KEY } from "@/services/queryKeys";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";

const HomePage = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getAllCategories(),
    queryKey: [CATEGORIES_QUERY_KEY],
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
        <HomeCarousel />
        <div style={{ marginTop: "2rem" }}>
          {data &&
            data.map(
              (category) =>
                category.products.length > 0 && (
                  <ProductCategory
                    key={category.id}
                    title={category.name}
                    href={`/category/${category.slug}`}
                    data={category.products}
                  />
                )
            )}
        </div>
      </PageWrapper>
    );
  }
};

export default HomePage;
