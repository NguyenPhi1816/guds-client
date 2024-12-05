"use client";

import React, { useState } from "react";
import { Card, Typography, Divider, Image } from "antd";
import { BlogDetail } from "@/types/blog";
import PageWrapper from "../wrapper/PageWrapper";
import { useQuery } from "@tanstack/react-query";
import { getBlogBySlug } from "@/services/blog";
import { BLOGS_QUERY_KEY } from "@/services/queryKeys";
import LoadingPage from "../pages/loadingPage";
import ErrorPage from "../pages/errorPage";
import { useParams } from "next/navigation";

const { Title, Paragraph, Text } = Typography;

const ViewBlog = () => {
  const { slug } = useParams();

  const {
    data: blog,
    isLoading: blogLoading,
    isError: blogError,
  } = useQuery({
    queryFn: async () => await getBlogBySlug(slug as string),
    queryKey: [BLOGS_QUERY_KEY],
  });

  if (blogLoading) {
    return <LoadingPage />;
  }

  if (blogError) {
    return <ErrorPage />;
  }

  if (blog) {
    return (
      <PageWrapper>
        <Card className="blog" style={{ width: "100%", height: "100%" }}>
          {/* Title */}
          <Title level={2}>{blog.title}</Title>

          {/* Metadata */}
          <Text type="secondary">
            Đăng bởi: {blog.author} |{" "}
            {new Date(blog.createAt).toLocaleDateString()}
          </Text>

          {/* Divider */}
          <Divider />

          {/* Cover Image */}
          <Image
            src={blog.image}
            alt={blog.title}
            style={{
              marginBottom: 20,
              borderRadius: 8,
              width: "50%",
              objectFit: "contain",
            }}
          />

          {/* Summary */}
          <Paragraph type="secondary">{blog.summary}</Paragraph>

          {/* Divider */}
          <Divider />

          {/* Content */}
          <div
            className="blog-container"
            dangerouslySetInnerHTML={{ __html: blog.content }}
            style={{ lineHeight: "1.8em" }}
          />
        </Card>
      </PageWrapper>
    );
  }
};

export default ViewBlog;
