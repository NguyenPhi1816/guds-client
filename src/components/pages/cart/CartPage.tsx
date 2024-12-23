"use client";
import styles from "./CartPage.module.scss";
import classNames from "classnames/bind";

import React, { useEffect, useState } from "react";
import {
  Table,
  Image,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  Checkbox,
  Spin,
  Space,
  InputNumber,
  Flex,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  ExclamationCircleFilled,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Cart, ExtendedCart } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "@/services/queryKeys";
import { deleteCart, getCart, updateCartQuantity } from "@/services/cart";
import { CartQuantityUpdateType } from "@/constant/enum/cartQuantityUpdateType";
import { useRouter } from "next/navigation";
import qs from "query-string";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";
import CustomBreadcrumb from "@/components/customBreadcrumb";
import ErrorPage from "../errorPage";
import LoadingPage from "../loadingPage";
import { formatCurrency } from "@/formater/CurrencyFormater";

const { Title, Text } = Typography;

const { confirm } = Modal;

const cx = classNames.bind(styles);

const CartPage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<ExtendedCart[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const message = useGlobalMessage();
  const [totalDiscount, setTotalDiscount] = useState<number>(0);

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getCart(),
    queryKey: [CART_QUERY_KEY],
  });

  const updateMutation = useMutation({
    mutationFn: (params: {
      productVariantId: number;
      quantity: number;
      type: CartQuantityUpdateType;
    }) =>
      updateCartQuantity(params.productVariantId, params.quantity, params.type),
    onSuccess: (data) => {
      queryClient.setQueryData([CART_QUERY_KEY], data);
    },
    onError: () => {
      message.error("Cập nhật giỏ hàng thất bại");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productVariantId: number) => deleteCart(productVariantId),
    onSuccess: (data) => {
      queryClient.setQueryData([CART_QUERY_KEY], data);
    },
    onError: () => {
      message.error("Xóa giỏ hàng thất bại");
    },
  });

  useEffect(() => {
    setTotalDiscount(
      selectedProducts.reduce((prev, item) => {
        if (Object.keys(item.discount).length > 0) {
          if (item.discount.type === "PERCENTAGE") {
            prev =
              prev + item.price * item.quantity * (item.discount.value / 100);
          } else {
            prev = prev + item.discount.value;
          }
        }
        return prev;
      }, 0)
    );
  }, [selectedProducts]);

  const handleSelect = (product: ExtendedCart, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, product]);
    } else {
      setSelectedProducts((prev) =>
        prev.filter(
          (item) => item.productVariantId !== product.productVariantId
        )
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(data || []);
    } else {
      setSelectedProducts([]);
    }
    setSelectAll(checked);
  };

  useEffect(() => {
    if (selectAll) {
      setSelectedProducts(data || []);
    }
  }, [selectAll, data]);

  const handleIncreaseQuantity = (productVariantId: number) => {
    updateMutation.mutate({
      quantity: 1,
      productVariantId,
      type: CartQuantityUpdateType.INCREMENT,
    });
  };

  const handleDecreseQuantity = (productVariantId: number) => {
    updateMutation.mutate({
      quantity: 1,
      productVariantId,
      type: CartQuantityUpdateType.DECREMENT,
    });
  };

  const handleSetQuantity = (
    previousValue: number,
    newValue: number,
    productVariantId: number
  ) => {
    if (previousValue > newValue) {
      const diff = previousValue - newValue;
      updateMutation.mutate({
        quantity: diff,
        productVariantId,
        type: CartQuantityUpdateType.DECREMENT,
      });
    } else if (previousValue < newValue) {
      const diff = newValue - previousValue;
      updateMutation.mutate({
        quantity: diff,
        productVariantId,
        type: CartQuantityUpdateType.INCREMENT,
      });
    }
  };

  const handleDelete = (productVariantId: number) => {
    confirm({
      title: "Xóa sản phẩm",
      icon: <ExclamationCircleFilled />,
      content: "Bạn muốn xóa sản phẩm này khỏi giỏ hàng?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        deleteMutation.mutate(productVariantId);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      message.error("Vui lòng chọn sản phẩm");
      return;
    }
    const queryString = qs.stringify({
      products: JSON.stringify(selectedProducts),
    });
    router.push(`/checkout?${queryString}&from-cart=true`);
  };

  const columns = [
    {
      title: (
        <Checkbox
          className={cx("checkbox")}
          checked={selectAll}
          onChange={(e: CheckboxChangeEvent) =>
            handleSelectAll(e.target.checked)
          }
        />
      ),
      dataIndex: "select",
      key: "select",
      render: (text: string, record: ExtendedCart) => (
        <Checkbox
          checked={selectedProducts.some(
            (item) => item.productVariantId === record.productVariantId
          )}
          onChange={(e: CheckboxChangeEvent) => {
            handleSelect(record, e.target.checked);
          }}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Cart) => (
        <Flex align="center">
          <img
            className={cx("cart-item-img")}
            src={record.productImage}
            alt={record.productName}
          />
          <Space direction="vertical" className={cx("cart-item-name")}>
            <Title level={5} ellipsis>
              {record.productName}
            </Title>
            <Text className={cx("cart-item-option-value")}>
              {record.optionValue ? record.optionValue.join(", ") : ""}
            </Text>
          </Space>
        </Flex>
      ),
    },
    {
      title: "Đơn Giá",
      key: "price",
      render: (record: ExtendedCart) => {
        let myPrice = record.price;

        if (record.discount.value && record.discount.type === "PERCENTAGE") {
          myPrice = record.price * ((100 - record.discount.value) / 100);
        } else if (record.discount.value && record.discount.type === "FIXED") {
          myPrice = record.price - record.discount.value;
          if (myPrice < 0) myPrice = 0;
        }

        return (
          <Flex justify="center" vertical>
            {record.discount.value && (
              <Text
                style={{ fontSize: "11px", textDecoration: "line-through" }}
              >
                {formatCurrency(record.price)}
              </Text>
            )}
            <Text style={{ fontWeight: 500 }}>{formatCurrency(myPrice)}</Text>
          </Flex>
        );
      },
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: Cart) => (
        <Space className={cx("quantity")}>
          <Button
            onClick={() => handleDecreseQuantity(record.productVariantId)}
            className={cx("quantity-item")}
          >
            <MinusOutlined />
          </Button>
          <InputNumber
            className={cx("quantity-item", "quantity-item-input")}
            controls={false}
            value={quantity}
            onBlur={(e) => {
              const newValue = Number.parseInt(e.target.value);
              handleSetQuantity(quantity, newValue, record.productVariantId);
            }}
          />
          <Button
            onClick={() => handleIncreaseQuantity(record.productVariantId)}
            className={cx("quantity-item")}
          >
            <PlusOutlined />
          </Button>
        </Space>
      ),
    },
    {
      title: "Tổng cộng",
      key: "total",
      render: (record: ExtendedCart) => {
        let myPrice = record.price;

        if (record.discount.value && record.discount.type === "PERCENTAGE") {
          myPrice = record.price * ((100 - record.discount.value) / 100);
        } else if (record.discount.value && record.discount.type === "FIXED") {
          myPrice = record.price - record.discount.value;
          if (myPrice < 0) myPrice = 0;
        }

        return (
          <Flex align="center">
            <Text>{formatCurrency(myPrice * record.quantity)}</Text>
          </Flex>
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (cart: Cart) => (
        <Button
          danger
          type="text"
          onClick={() => handleDelete(cart.productVariantId)}
        >
          <DeleteOutlined />
          Xóa
        </Button>
      ),
    },
  ];

  const totalPrice = selectedProducts.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

  if (data) {
    return (
      <PageWrapper>
        <CustomBreadcrumb currentPageName="Giỏ hàng" />
        <Title level={2}>Giỏ hàng</Title>
        <div className={cx("cartPageWrapper")}>
          <Table
            bordered={false}
            className={cx("tableWrapper")}
            columns={columns}
            dataSource={data}
            rowKey="productVariantId"
            pagination={false}
          />
          <div className={cx("summaryWrapper")}>
            <Title level={4}>Tổng kết giỏ hàng</Title>
            <Divider />
            {selectedProducts.length > 0 ? (
              selectedProducts.map((product, index) => (
                <div
                  key={product.productVariantId}
                  className={cx("productSummary")}
                >
                  <Row gutter={16}>
                    <Col>
                      <Image
                        width={50}
                        src={product.productImage}
                        alt={product.productName}
                      />
                    </Col>
                    <Col>
                      <Text strong>{product.productName}</Text>
                      <br />
                      <Text className={cx("summary-text")}>
                        {product.optionValue.join(", ")}
                      </Text>
                      <br />
                      <Text className={cx("summary-text")}>
                        Số lượng: {product.quantity}
                      </Text>
                      <br />
                      <Text className={cx("summary-text")}>
                        Giá:{" "}
                        {(product.price * product.quantity).toLocaleString()}{" "}
                        VND
                      </Text>
                    </Col>
                  </Row>
                  {index < selectedProducts.length - 1 && (
                    <Divider className={cx("summary-divider")} />
                  )}
                </div>
              ))
            ) : (
              <Text>Vui lòng chọn sản phẩm</Text>
            )}
            {totalDiscount > 0 && (
              <>
                <Divider />
                <Row className={cx("totalRow")}>
                  <Text strong>Giảm giá sản phẩm:</Text>
                  <Text strong>-{formatCurrency(totalDiscount)}</Text>
                </Row>
              </>
            )}
            <Divider />
            <Row className={cx("totalRow")}>
              <Text strong>Tổng cộng:</Text>
              <Text strong>
                {formatCurrency(
                  totalPrice - totalDiscount < 0
                    ? 0
                    : totalPrice - totalDiscount
                )}
              </Text>
            </Row>
            <Divider />
            <Button
              type="primary"
              block
              size="large"
              className={cx("checkout-btn")}
              onClick={handleCheckout}
            >
              Thanh toán
            </Button>
          </div>
        </div>
      </PageWrapper>
    );
  }
};

export default CartPage;
