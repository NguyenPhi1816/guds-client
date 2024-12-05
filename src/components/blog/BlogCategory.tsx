import { Flex, List, Typography } from "antd";
import ProductCard from "../productCard";
import Link from "next/link";
import { CategoryProduct, CategoryResponse } from "@/types/category";
import React from "react";
import { ProductVariant } from "@/types/product";
import { Blog } from "@/types/blog";
import BlogCard from "./Blog";

const { Title } = Typography;

interface IBlogCategory {
  title: string;
  href: string;
  data: Blog[];
}

const BlogCategory: React.FC<IBlogCategory> = ({ title, href, data }) => {
  return (
    <div style={{ marginTop: "1rem" }}>
      <Flex
        style={{ marginBottom: "1rem" }}
        align="center"
        justify="space-between"
      >
        <Title style={{ marginBottom: 0 }} level={4}>
          {title}
        </Title>
        <Link href={href} style={{ color: "var(--light-yellow)" }}>
          Xem thêm
        </Link>
      </Flex>
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <BlogCard data={item} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default BlogCategory;
