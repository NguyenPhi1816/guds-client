"use client";
import { BLOGS_QUERY_KEY } from "@/services/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { Flex, Grid, List, Typography } from "antd";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";
import { getBlogsByCategoryId } from "@/services/blog";
import { useParams } from "next/navigation";
import BlogCard from "@/components/blog/Blog";

const { Text, Title } = Typography;

const CategoryBlog = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryFn: async () =>
      await getBlogsByCategoryId(Number.parseInt(id as string)),
    queryKey: [BLOGS_QUERY_KEY],
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (data) {
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
        <Title>{data.name}</Title>
        <Text style={{ color: "var(--grey)" }}>{data.description}</Text>
        <Title level={3}>Bài viết trong danh mục {data.name}</Title>
        <List
          grid={{ gutter: 16, column: 4 }}
          dataSource={data.blogs}
          renderItem={(item) => (
            <List.Item>
              <BlogCard data={item} />
            </List.Item>
          )}
        />
      </Flex>
    );
  }
};

export default CategoryBlog;
