"use client";
import { getListCategoryBlogs } from "@/services/blog";
import { BLOGS_QUERY_KEY } from "@/services/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { Flex } from "antd";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";
import BlogCategory from "@/components/blog/BlogCategory";

const BlogPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getListCategoryBlogs(),
    queryKey: [BLOGS_QUERY_KEY],
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <Flex
      vertical
      gap={16}
      style={{
        backgroundColor: "#FFF",
        padding: "16px",
        height: "calc(100vh - var(--app-header-height))",
      }}
    >
      {data &&
        data.map((item) => (
          <BlogCategory
            data={item.blogs}
            href={`/category-blog/${item.id}`}
            title={item.name}
          />
        ))}
    </Flex>
  );
};

export default BlogPage;
