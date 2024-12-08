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
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";
import LoadingPage from "../pages/loadingPage";
import ErrorPage from "../pages/errorPage";
import { useRouter } from "next/navigation";
import { BrandProduct } from "@/types/brand";

const { Meta } = Card;

const cx = classNames.bind(styles);

interface IProductCard {
  product: CategoryProduct | ProductVariant | BrandProduct;
}

const ProductCard: React.FC<IProductCard> = ({ product }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [favoriteProducts, _setFavoriteProducts] = useState<
    (CategoryProduct | ProductVariant | BrandProduct)[]
  >([]);
  const message = useGlobalMessage();

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getFavoriteProducts(),
    queryKey: [FAVORITE_PRODUCT_QUERY_KEY],
  });

  const mutation = useMutation({
    mutationFn: () => setFavoriteProducts(product),
    onSuccess: (data) => {
      message.success("Thêm vào danh sách yêu thích thành công");
      queryClient.setQueryData([FAVORITE_PRODUCT_QUERY_KEY], data);
    },
    onError: (error) => {
      console.log(error.message);

      message.error("Thêm vào danh sách yêu thích thất bại");
    },
  });

  useEffect(() => {
    if (data) {
      _setFavoriteProducts(data.data);
    }
  }, [data]);

  const handleAddToFavorite = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();
    mutation.mutate();
  };

  // if (isLoading) {
  //   return <LoadingPage />;
  // }

  // if (isError) {
  //   return router.push("/error");
  // }

  let discount = 0;
  if (product.discount && Object.keys(product.discount).length > 0) {
    if (product.discount.type === "PERCENTAGE") {
      discount = (product.discount.value / 100) * product.price;
    } else if (product.discount.type === "FIXED") {
      discount = product.discount.value;
    }
  }

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
            <>
              {discount > 0 ? (
                <p style={{ textDecoration: "line-through", fontSize: 11 }}>
                  {formatCurrency(product.price)}
                </p>
              ) : (
                <p
                  style={{
                    textDecoration: "line-through",
                    fontSize: 11,
                    opacity: 0,
                  }}
                >
                  hidden text
                </p>
              )}
              <p className={cx("price")}>
                {formatCurrency(
                  product.price - discount < 0 ? 0 : product.price - discount
                )}
              </p>
            </>
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
