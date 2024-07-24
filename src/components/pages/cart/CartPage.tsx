"use client";
import styles from "./CartPage.module.scss";
import classNames from "classnames/bind";

import React, { FocusEvent, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";
import { CART_QUERY_KEY } from "@/services/queryKeys";
import { getCart } from "@/services/cart";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const CartPage: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<Cart[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getCart(),
    queryKey: [CART_QUERY_KEY],
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

  const handleIncreaseQuantity = () => {
    // const newValue = quantity + 1;
    // if (variant && newValue > variant.quantity) {
    //   messageApi.error("Đã đạt số lượng tối đa");
    //   return;
    // }
    // setQuantity(newValue);
  };

  const handleDecreseQuantity = () => {
    // const newValue = quantity - 1;
    // if (newValue < 1) {
    //   return;
    // }
    // setQuantity(newValue);
  };

  const handleSetQuantity = (e: FocusEvent<HTMLInputElement, Element>) => {
    // const num = Number.parseInt(e.target.value);
    // if (variant && num) {
    //   if (num > variant.quantity) {
    //     setQuantity(variant.quantity);
    //     messageApi.error("Đã đạt số lượng tối đa");
    //     return;
    //   }
    //   if (num < 1) {
    //     setQuantity(1);
    //     return;
    //   }
    //   setQuantity(num);
    // }
  };

  const columns = [
    {
      title: (
        <Checkbox
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
      render: () => (
        <Button danger type="text">
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
              <Button type="primary" block size="large">
                Thanh toán
              </Button>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
};

export default CartPage;
