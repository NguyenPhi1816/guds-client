import React from "react";
import { Card, Typography } from "antd";
import { Blog } from "@/types/blog";
import { useRouter } from "next/navigation";

const { Meta } = Card;
const { Title, Text } = Typography;

interface BlogCardProps {
  data: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ data }) => {
  const router = useRouter();

  return (
    <Card
      hoverable
      cover={
        <img
          alt={data.title}
          src={data.image}
          style={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
        />
      }
      onClick={() => router.push(`/blog/${data.slug}`)}
    >
      <Meta
        title={
          <Title
            level={5}
            style={{
              fontSize: 14,
            }}
            ellipsis={false}
          >
            {data.title}
          </Title>
        }
        description={
          <div>
            <p
              style={{
                marginBottom: "8px",
                fontSize: 12,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                minHeight: 58,
              }}
            >
              {data.summary}
            </p>
            <small style={{ fontSize: 11 }}>
              {new Date(data.createAt).toLocaleDateString()}
            </small>
          </div>
        }
      />
    </Card>
  );
};

export default BlogCard;
