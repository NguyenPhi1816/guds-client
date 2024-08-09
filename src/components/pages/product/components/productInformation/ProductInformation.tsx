"use client";
import styles from "./ProductInformation.module.scss";
import classNames from "classnames/bind";
import { FocusEvent, useEffect, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Image,
  InputNumber,
  Rate,
  Space,
  Typography,
} from "antd";
import {
  BaseProduct,
  BaseProductOptionValue,
  BaseProductVariant,
} from "@/types/product";
import { formatCurrency } from "@/formater/CurrencyFormater";
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import useMessage from "antd/es/message/useMessage";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addProductToCart } from "@/services/cart";
import { CART_QUERY_KEY, SESSION_QUERY_KEY } from "@/services/queryKeys";
import { getSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { Cart } from "@/types/cart";
import qs from "query-string";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";
import LoadingPage from "@/components/pages/loadingPage";
import ErrorPage from "@/components/pages/errorPage";
import { productStatus } from "@/constant/enum/productStatus";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

interface IProductInformation {
  data: BaseProduct;
  spid: string;
}

const ProductInformation: React.FC<IProductInformation> = ({ data, spid }) => {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [mainImage, setMainImage] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [variant, setVariant] = useState<BaseProductVariant>();
  const [selectedOptionValues, setSelectedOptionValues] = useState<
    BaseProductOptionValue[]
  >([]);
  const [optionValuesChanged, setOptionValuesChanged] =
    useState<boolean>(false);
  const [quantity, setQuantity] = useState<number>(1);
  const message = useGlobalMessage();

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryFn: async () => await getSession(),
    queryKey: [SESSION_QUERY_KEY],
  });

  const mutation = useMutation({
    mutationFn: (params: { id: number; quantity: number }) =>
      addProductToCart(params.id, params.quantity),
    onSuccess: (data) => {
      message.success("Thêm vào giỏ hàng thành công");
      queryClient.setQueryData([CART_QUERY_KEY], data);
    },
    onError: () => {
      message.error("Thêm vào giỏ hàng thất bại");
    },
  });

  useEffect(() => {
    if (data) {
      if (spid) {
        const mainImage = data.images.find((image) => image.isDefault === true);
        if (mainImage) {
          setMainImage(mainImage.path);
        }

        const images = data.images.map((image) => image.path);
        setImages(images);

        const productVariant = data.productVariants.find(
          (variant) => variant.id.toString() === spid
        );
        if (productVariant) {
          setSelectedOptionValues(productVariant.optionValue);
        }
      } else {
        // Initialize selected option values if spid is not present
        const initialSelectedValues = data.optionValues.map((optionValue) => ({
          option: optionValue.option,
          value: optionValue.values[0], // default to the first value
        }));
        setSelectedOptionValues(initialSelectedValues);
      }
    }
  }, [data, spid]);

  useEffect(() => {
    if (data) {
      const variant = data.productVariants.find((productVariant) => {
        return productVariant.optionValue.reduce((prev, curr, currIndex) => {
          if (!selectedOptionValues[currIndex]) {
            return true;
          }

          return (
            prev &&
            curr.option === selectedOptionValues[currIndex].option &&
            curr.value === selectedOptionValues[currIndex].value
          );
        }, true);
      });
      if (variant) {
        setVariant(variant);
        if (optionValuesChanged) {
          setMainImage(variant.image);
        }
      }
    }
  }, [selectedOptionValues]);

  const isValueSelected = (option: string, value: string): boolean => {
    return !!selectedOptionValues.find(
      (selectedOptionValue) =>
        selectedOptionValue.option === option &&
        selectedOptionValue.value === value
    );
  };

  const handleSelectValue = (option: string, value: string) => {
    if (data) {
      setSelectedOptionValues((prev) => {
        const newValue = prev.map((selectedOptionValue) => {
          if (selectedOptionValue.option === option) {
            return { ...selectedOptionValue, value };
          }
          return selectedOptionValue;
        });
        return newValue;
      });
      if (!optionValuesChanged) {
        setOptionValuesChanged(true);
      }
    }
  };

  const handleIncreaseQuantity = () => {
    const newValue = quantity + 1;
    if (variant && newValue > variant.quantity) {
      message.error("Đã đạt số lượng tối đa");
      return;
    }
    setQuantity(newValue);
  };

  const handleDecreseQuantity = () => {
    const newValue = quantity - 1;
    if (newValue < 1) {
      return;
    }
    setQuantity(newValue);
  };

  const handleSetQuantity = (e: FocusEvent<HTMLInputElement, Element>) => {
    const num = Number.parseInt(e.target.value);
    if (variant && num) {
      if (num > variant.quantity) {
        setQuantity(variant.quantity);
        message.error("Đã đạt số lượng tối đa");
        return;
      }

      if (num < 1) {
        setQuantity(1);
        return;
      }

      setQuantity(num);
    }
  };

  const handleAddProductToCart = () => {
    if (!session || !session.user) {
      router.push(`/login?redirect=${pathname}?spid=${spid}`);
      return;
    }

    if (variant && quantity) {
      mutation.mutate({ id: variant.id, quantity });
    }
  };

  const handleCheckout = () => {
    if (variant) {
      const product: Cart = {
        productVariantId: variant.id,
        image: variant.image,
        name: data.name,
        optionValues: variant.optionValue.map((option) => option.value),
        price: variant.price,
        quantity: quantity,
      };
      const queryString = qs.stringify({
        products: JSON.stringify([product]),
      });
      router.push(`/checkout?${queryString}`);
    }
  };

  if (sessionLoading) {
    return <LoadingPage />;
  }

  if (sessionError) {
    return <ErrorPage />;
  }

  console.log(data.averageRating);

  return (
    data &&
    variant && (
      <Flex justify="space-between">
        <Space align="start" className={cx("section-1-left")}>
          <Space direction="vertical" className={cx("section-1-left-bottom")}>
            {images.map((image, index) => (
              <div
                key={index}
                className={cx("section-1-left-bottom-image")}
                onClick={() => setMainImage(image)}
              >
                <Image preview={false} src={image} />
              </div>
            ))}
          </Space>
          <div className={cx("section-1-left-top")}>
            <img src={mainImage} alt={data.name} />
          </div>
        </Space>
        <div className={cx("section-1-right")}>
          <div className={cx("brand")}>
            <Link href={`/brand/${data.brand.slug}`}>
              <Space align="center">
                <img
                  className={cx("brand-image")}
                  src={data.brand.image}
                  alt={data.brand.name}
                />
                <Text className={cx("brand-name")}>{data.brand.name}</Text>
              </Space>
            </Link>
          </div>
          <Title level={2}>{data.name}</Title>
          <Space align="center" className={cx("summary")}>
            {data.numberOfReviews > 0 ? (
              <>
                <Text className={cx("summary-item")}>
                  {data.averageRating?.toFixed(1)}
                </Text>
                <Rate disabled defaultValue={data.averageRating} />
              </>
            ) : (
              <Text className={cx("summary-item")}>Chưa có đánh giá</Text>
            )}
            <Divider type="vertical" />
            <Text className={cx("summary-item")}>
              {data.numberOfPurchases} lượt mua
            </Text>
            <Divider type="vertical" />
            <Text className={cx("summary-item")}>
              {data.numberOfReviews} lượt đánh giá
            </Text>
          </Space>
          <Title level={2} className={cx("price")}>
            {formatCurrency(variant.price)}
          </Title>
          {data.optionValues.length > 0 && (
            <>
              {" "}
              <Title level={5}>Tùy chọn</Title>
              <Space direction="vertical" className={cx("option-values")}>
                {data.optionValues.map((optionValue) => (
                  <Space key={optionValue.option} direction="vertical">
                    <Text>{optionValue.option}</Text>
                    <Space>
                      {optionValue.values.map((value) => (
                        <Button
                          key={value}
                          className={cx("value-btn", {
                            "value-btn-selected": isValueSelected(
                              optionValue.option,
                              value
                            ),
                          })}
                          onClick={() =>
                            handleSelectValue(optionValue.option, value)
                          }
                        >
                          {value}
                        </Button>
                      ))}
                    </Space>
                  </Space>
                ))}
              </Space>
            </>
          )}
          <Title level={5}>Số lượng</Title>
          <Space className={cx("quantity")}>
            <Button
              onClick={handleDecreseQuantity}
              className={cx("quantity-item")}
            >
              <MinusOutlined />
            </Button>
            <InputNumber
              className={cx("quantity-item")}
              width={32}
              controls={false}
              value={quantity}
              onBlur={(e) => handleSetQuantity(e)}
            />
            <Button
              onClick={handleIncreaseQuantity}
              className={cx("quantity-item")}
            >
              <PlusOutlined />
            </Button>
          </Space>
          {data.status === productStatus.ACTIVE ? (
            <Space align="center">
              <Button
                size="large"
                className={cx("btn-add-to-card")}
                onClick={handleAddProductToCart}
              >
                <ShoppingCartOutlined />
                Thêm vào giỏ hàng
              </Button>
              <Button
                size="large"
                type="primary"
                className={cx("btn-buy")}
                onClick={handleCheckout}
              >
                Mua hàng
              </Button>
            </Space>
          ) : (
            <Title level={4} className={cx("inactive-status")}>
              Sản phẩm đã ngừng kinh doanh
            </Title>
          )}
        </div>
      </Flex>
    )
  );
};

export default ProductInformation;
