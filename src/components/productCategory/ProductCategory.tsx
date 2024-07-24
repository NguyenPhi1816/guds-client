import { Flex, List, Typography } from "antd";
import ProductCard from "../productCard";
import Link from "next/link";
import { CategoryProduct, CategoryResponse } from "@/types/category";
import React from "react";
import { ProductVariant } from "@/types/product";

const { Title } = Typography;

interface IProductCategory {
  title: string;
  href: string;
  data: ProductVariant[] | CategoryProduct[];
}

const ProductCategory: React.FC<IProductCategory> = ({ title, href, data }) => {
  return (
    <div style={{ marginTop: "1rem" }}>
      <Flex
        style={{ marginBottom: "1rem" }}
        align="center"
        justify="space-between"
      >
        <Title style={{ marginBottom: 0 }} level={4}>
          Danh mục {title}
        </Title>
        <Link href={href} style={{ color: "var(--light-yellow)" }}>
          Xem thêm
        </Link>
      </Flex>
      <List
        grid={{ gutter: 16, column: 5 }}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <ProductCard product={item} />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ProductCategory;
