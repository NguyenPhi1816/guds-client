import styles from "./ProductReview.module.scss";
import classNames from "classnames/bind";

import { getReviewsByBaseProductSlug } from "@/services/review";
import { useQuery } from "@tanstack/react-query";
import {
  Avatar,
  Button,
  Divider,
  Empty,
  Flex,
  Rate,
  Space,
  Spin,
  Typography,
} from "antd";
import React from "react";
import { REVIEWS_QUERY_KEY } from "@/services/queryKeys";

const { Title, Text } = Typography;

interface IProductReview {
  slug: string;
  averageRating: number;
}

const cx = classNames.bind(styles);

const ProductReview: React.FC<IProductReview> = ({ slug, averageRating }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [REVIEWS_QUERY_KEY],
    queryFn: async () => await getReviewsByBaseProductSlug(slug),
  });

  if (isError) {
    return <div>Có lỗi xảy ra</div>;
  }

  return (
    data && (
      <div>
        <Title level={4}>Đánh giá từ khách hàng</Title>
        {data.length > 0 ? (
          <>
            <Flex className={cx("overall")}>
              <Flex vertical justify="center">
                <Flex justify="center" align="end">
                  <Text className={cx("overall-average-number")}>
                    {averageRating}
                  </Text>
                  <Text className={cx("overall-number")}>trên 5</Text>
                </Flex>
                <Rate
                  className={cx("overall-average-rating")}
                  disabled
                  defaultValue={averageRating}
                />
              </Flex>
              <Flex className={cx("overall-btn")}>
                <Button
                  className={cx("overall-btn-item", "overall-btn-item-checked")}
                >
                  Tất cả
                </Button>
              </Flex>
            </Flex>
            <Space direction="vertical" size={"large"} className={cx("review")}>
              {data.map((item) => (
                <Space align="start" key={item.id}>
                  <Avatar shape="circle" src={item.customer.image} />
                  <Flex vertical className={cx("content")}>
                    <Space direction="vertical" size={"small"}>
                      <Text className={cx("content-name")}>
                        {item.customer.firstName + " " + item.customer.lastName}
                      </Text>
                      <Rate
                        disabled
                        defaultValue={item.rating}
                        className={cx("content-rating")}
                      />
                      <Space>
                        <Text className={cx("content-created-at")}>
                          {item.createdAt}
                        </Text>
                        <Divider
                          type="vertical"
                          className={cx("content-divider")}
                        />
                        <Text className={cx("content-variant")}>
                          {item.variant}
                        </Text>
                      </Space>
                    </Space>
                    <Text className={cx("content-comment")}>
                      {item.comment}
                    </Text>
                  </Flex>
                </Space>
              ))}
            </Space>
          </>
        ) : (
          <Empty description="Chưa có đánh giá" />
        )}
      </div>
    )
  );
};

export default ProductReview;
