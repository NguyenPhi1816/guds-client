"use client";
import { useSearchParams } from "next/navigation";
import styles from "./CheckoutPage.module.scss";
import classNames from "classnames/bind";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Typography,
  Row,
  Divider,
  Spin,
  Space,
  Flex,
  Radio,
} from "antd";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { Cart } from "@/types/cart";
import { useQueryClient } from "@tanstack/react-query";
import useMessage from "antd/es/message/useMessage";
import { useRouter } from "next/navigation";
import { PaymentMethod } from "@/constant/enum/paymentMethod";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Cart[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [messageApi, contextHolder] = useMessage();

  useEffect(() => {
    setLoading(true);
    const productsJson = searchParams.get("products");
    if (productsJson) {
      const products = JSON.parse(productsJson);
      setData(products);
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [searchParams]);

  const handleCheckout = () => {};

  const columns = [
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
    },
    {
      title: "Tổng cộng",
      key: "total",
      render: (text: string, record: Cart) => (
        <Text>{(record.price * record.quantity).toLocaleString()} VND</Text>
      ),
    },
  ];

  const totalPrice = data.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <PageWrapper>
      <Title level={2}>Thanh toán</Title>
      <div className={cx("cartPageWrapper")}>
        {isLoading ? (
          <div className={cx("spinner-container")}>
            <Spin className={cx("spinner")} size="large" />
            <Text>Đang tải dữ liệu đơn hàng</Text>
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
              <Title level={4}>Tổng kết đơn hàng</Title>
              <Divider />
              <Row className={cx("totalRow")}>
                <Space direction="vertical">
                  <Text strong>Phương thức thanh toán:</Text>
                  <Radio.Group
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <Space direction="vertical">
                      <Radio value={PaymentMethod.CASH}>Tiền mặt</Radio>
                      <Radio value={PaymentMethod.VNPAY}>Ví VNPay</Radio>
                    </Space>
                  </Radio.Group>
                </Space>
              </Row>
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

export default CheckoutPage;
