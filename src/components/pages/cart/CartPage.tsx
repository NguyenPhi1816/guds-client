"use client";
import styles from "./CartPage.module.scss";
import classNames from "classnames/bind";

import React, { FocusEvent, useEffect, useState } from "react";
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
} from "antd";
import { DeleteOutlined, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { Cart } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "@/services/queryKeys";
import { deleteCart, getCart, updateCartQuantity } from "@/services/cart";
import { CartQuantityUpdateType } from "@/constant/enum/cartQuantityUpdateType";
import useMessage from "antd/es/message/useMessage";
import { useRouter } from "next/navigation";
import qs from "query-string";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const CartPage: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<Cart[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [messageApi, contextHolder] = useMessage();

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
      messageApi.error("Cập nhật giỏ hàng thất bại");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productVariantId: number) => deleteCart(productVariantId),
    onSuccess: (data) => {
      queryClient.setQueryData([CART_QUERY_KEY], data);
    },
    onError: () => {
      messageApi.error("Xóa giỏ hàng thất bại");
    },
  });

  const handleSelect = (product: Cart, checked: boolean) => {
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
    deleteMutation.mutate(productVariantId);
  };

  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      messageApi.error("Vui lòng chọn sản phẩm");
      return;
    }
    const queryString = qs.stringify({
      products: JSON.stringify(selectedProducts),
    });
    router.push(`/checkout?${queryString}`);
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
      render: (text: string, record: Cart) => (
        <Checkbox
          checked={selectedProducts.some(
            (item) => item.productVariantId === record.productVariantId
          )}
          onChange={(e: CheckboxChangeEvent) =>
            handleSelect(record, e.target.checked)
          }
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
            src={record.image}
            alt={record.name}
          />
          <Space direction="vertical">
            <Title level={5} ellipsis>
              {record.name}
            </Title>
            <Text className={cx("cart-item-option-value")}>
              {record.optionValues.join(", ")}
            </Text>
          </Space>
        </Flex>
      ),
    },
    {
      title: "Đơn Giá",
      dataIndex: "price",
      key: "price",
      render: (text: number) => (
        <Flex align="center">
          <Text>{text.toLocaleString()} VND</Text>
        </Flex>
      ),
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
      render: (text: string, record: Cart) => (
        <Text>{(record.price * record.quantity).toLocaleString()} VND</Text>
      ),
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

  return (
    <PageWrapper>
      <Title level={2}>Giỏ hàng</Title>
      <div className={cx("cartPageWrapper")}>
        {isLoading ? (
          <div className={cx("spinner-container")}>
            <Spin className={cx("spinner")} size="large" />
            <Text>Đang tải dữ liệu giỏ hàng</Text>
          </div>
        ) : (
          <>
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
                          src={product.image}
                          alt={product.name}
                        />
                      </Col>
                      <Col>
                        <Text strong>{product.name}</Text>
                        <br />
                        <Text className={cx("summary-text")}>
                          {product.optionValues.join(", ")}
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
              <Divider />
              <Row className={cx("totalRow")}>
                <Text strong>Tổng cộng:</Text>
                <Text strong>{totalPrice.toLocaleString()} VND</Text>
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
          </>
        )}
      </div>
      {contextHolder}
    </PageWrapper>
  );
};

export default CartPage;
