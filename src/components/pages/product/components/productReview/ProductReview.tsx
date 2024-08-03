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
  Radio,
  Rate,
  Space,
  Spin,
  Typography,
} from "antd";
import React, { useState } from "react";
import { REVIEWS_QUERY_KEY } from "@/services/queryKeys";
import LoadingPage from "@/components/pages/loadingPage";
import ErrorPage from "@/components/pages/errorPage";

const { Title, Text } = Typography;

interface IProductReview {
  slug: string;
  averageRating: number;
}

const cx = classNames.bind(styles);

const filterItems: { queryParam: string; name: string }[] = [
  {
    queryParam: "",
    name: "Tất cả",
  },
  {
    queryParam: "?rating=5",
    name: "5 Sao",
  },
  {
    queryParam: "?rating=4",
    name: "4 Sao",
  },
  {
    queryParam: "?rating=3",
    name: "3 Sao",
  },
  {
    queryParam: "?rating=2",
    name: "2 Sao",
  },
  {
    queryParam: "?rating=1",
    name: "1 Sao",
  },
];

const ProductReview: React.FC<IProductReview> = ({ slug, averageRating }) => {
  const [queryParam, setQueryParam] = useState<string>(
    filterItems[0].queryParam
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: [REVIEWS_QUERY_KEY, queryParam],
    queryFn: async () => await getReviewsByBaseProductSlug(slug, queryParam),
  });

  return (
    <div>
      <Title level={4}>Đánh giá từ khách hàng</Title>
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
        <Space className={cx("overall-btn")}>
          <Radio.Group
            defaultValue={filterItems[0].queryParam}
            size="large"
            onChange={(e) => {
              const value = e.target.value;
              setQueryParam(value);
            }}
          >
            {filterItems.map((item) => (
              <Radio.Button key={item.queryParam} value={item.queryParam}>
                {item.name}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Space>
      </Flex>
      {data && data.length > 0 ? (
        <>
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
                  <Text className={cx("content-comment")}>{item.comment}</Text>
                </Flex>
              </Space>
            ))}
          </Space>
        </>
      ) : (
        <Flex justify="center" align="center">
          <Empty className={cx("review")} description="Chưa có đánh giá" />
        </Flex>
      )}
    </div>
  );
};

export default ProductReview;
