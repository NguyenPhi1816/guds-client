import styles from "./ProductCard.module.scss";
import classNames from "classnames/bind";

import React, { useEffect, useState } from "react";
import { Card, Rate, Image, Button } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { CategoryProduct } from "@/types/category";
import { formatCurrency } from "@/formater/CurrencyFormater";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFavoriteProducts, setFavoriteProducts } from "@/services/cookie";
import useMessage from "antd/es/message/useMessage";
import Link from "next/link";
import { ProductVariant } from "@/types/product";
import { FAVORITE_PRODUCT_QUERY_KEY } from "@/services/queryKeys";

const { Meta } = Card;

const cx = classNames.bind(styles);

interface IProductCard {
  product: CategoryProduct | ProductVariant;
}

const ProductCard: React.FC<IProductCard> = ({ product }) => {
  const queryClient = useQueryClient();
  const [favoriteProducts, _setFavoriteProducts] = useState<
    (CategoryProduct | ProductVariant)[]
  >([]);
  const [messageApi, contextHolder] = useMessage();

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getFavoriteProducts(),
    queryKey: [FAVORITE_PRODUCT_QUERY_KEY],
  });

  const mutation = useMutation({
    mutationFn: () => setFavoriteProducts(product),
    onSuccess: (data) => {
      messageApi.success("Thêm vào danh sách yêu thích thành công");
      queryClient.setQueryData([FAVORITE_PRODUCT_QUERY_KEY], data);
    },
    onError: () => {
      messageApi.error("Thêm vào danh sách yêu thích thất bại");
    },
  });

  useEffect(() => {
    if (data) {
      _setFavoriteProducts(data.data);
    }
  }, [data]);

  if (isError) {
    messageApi.error("Có lỗi xảy ra trong quá trình tải dữ liệu");
  }

  const handleAddToFavorite = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate();
  };

  return (
    <Link href={`/product/${product.slug}?spid=${product.variantId}`}>
      <Card
        hoverable
        style={{
          width: "var(--product-card-width)",
          borderRadius: 8,
          overflow: "hidden",
        }}
        cover={
          <div className={cx("cover")}>
            <Button
              shape="circle"
              type="text"
              className={cx("cover-btn")}
              onClick={(e) => handleAddToFavorite(e)}
            >
              {favoriteProducts.map((item) => item.id).includes(product.id) ? (
                <HeartFilled className={cx("cover-btn-filled")} />
              ) : (
                <HeartOutlined />
              )}
            </Button>
            <Image
              className={cx("cover-img")}
              alt={product.name}
              src={product.image}
              style={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
              preview={false}
            />
          </div>
        }
      >
        <Meta
          title={product.name}
          description={
            <p className={cx("price")}>{formatCurrency(product.price)}</p>
          }
        />
        <div className={cx("bottom")}>
          {product.numberOfReviews > 0 ? (
            <Rate
              disabled
              defaultValue={product.averageRating}
              style={{ fontSize: 12 }}
            />
          ) : (
            <span className={cx("bottom-text")}>Chưa có đánh giá</span>
          )}
          <span className={cx("bottom-text")}>
            {product.numberOfPurchases} lượt mua
          </span>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
