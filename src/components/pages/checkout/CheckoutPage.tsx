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
  Input,
} from "antd";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { Cart, ExtendedCart } from "@/types/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useMessage from "antd/es/message/useMessage";
import { useRouter } from "next/navigation";
import { PaymentMethod } from "@/constant/enum/paymentMethod";
import { createVNPayPaymentURL } from "@/services/payment";
import { getSession } from "next-auth/react";
import { CART_QUERY_KEY, SESSION_QUERY_KEY } from "@/services/queryKeys";
import OrderReceiverModal from "@/components/modal/orderReceiverModal";
import { CreateOrderRequest, OrderDetailRequest } from "@/types/order";
import { createOrder } from "@/services/order";
import { deleteCart } from "@/services/cart";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";
import { error } from "console";
import { getProfile } from "@/services/user";

const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [data, setData] = useState<ExtendedCart[]>([]);
  const [fromCart, setFromCart] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.CASH
  );
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddess] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const message = useGlobalMessage();

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryFn: async () => await getSession(),
    queryKey: [SESSION_QUERY_KEY],
  });

  const createVNPayMutation = useMutation({
    mutationFn: (params: {
      amount: number;
      orderId: number;
      orderDescription: string;
    }) =>
      createVNPayPaymentURL(
        params.amount,
        params.orderId,
        params.orderDescription
      ),
    onSuccess: (data) => router.replace(data.paymentUrl),
  });

  const createOrderMutation = useMutation({
    mutationFn: (createOrderRequest: CreateOrderRequest) =>
      createOrder(createOrderRequest),
    onSuccess: async (data) => {
      if (fromCart) {
        const deletePromises = data.orderDetails.map((orderDetail) =>
          deleteMutation.mutateAsync(orderDetail.productVariantId)
        );
        await Promise.all(deletePromises);
      }
      return handlePayment(data.payment.totalPrice, data.order.id);
    },
    onError: (error) => message.error(error.message),
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

  const getProfileMutation = useMutation({
    mutationFn: (accessToken: string) => getProfile(accessToken),
    onSuccess: (data) => {
      setName(data.firstName + " " + data.lastName);
      setPhoneNumber(data.phoneNumber);
      setAddess(data.address);
    },
    onError: () => {
      message.error("Lấy thông tin người dùng thất bại");
    },
  });

  useEffect(() => {
    if (session && session.user) {
      getProfileMutation.mutate(session.user.accessToken);
    }
  }, [session]);

  useEffect(() => {
    setLoading(true);
    const productsJson = searchParams.get("products");
    const cartId = searchParams.get("from-cart");
    setFromCart(cartId === "true");
    if (productsJson) {
      const products = JSON.parse(productsJson);
      setData(products);
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [searchParams]);

  const handleReceiverInfoChange = (
    name: string,
    phoneNumber: string,
    address: string
  ) => {
    setName(name);
    setPhoneNumber(phoneNumber);
    setAddess(address);
  };

  const handleCheckout = () => {
    const orderDetails: OrderDetailRequest[] = data.map((item) => ({
      baseProductId: item.baseProductId,
      categoryIds: item.categoryIds,
      productVariantId: item.productVariantId,
      quantity: item.quantity,
      price: item.price,
    }));
    const request: CreateOrderRequest = {
      note: note,
      paymentMethod: paymentMethod,
      paymentDate: null,
      transactionId: null,
      orderDetails: orderDetails,
      receiverName: name,
      receiverPhoneNumber: phoneNumber,
      receiverAddress: address,
    };
    createOrderMutation.mutate(request);
  };

  const handlePayment = (amount: number, orderId: number) => {
    switch (paymentMethod) {
      case PaymentMethod.CASH: {
        router.push(`/checkout/payment-status?status=success`);
        break;
      }
      case PaymentMethod.VNPAY: {
        createVNPayMutation.mutate({
          amount,
          orderId,
          orderDescription: "Thanh toan don hang Guds. Ma don hang " + orderId,
        });
        break;
      }
      default: {
        message.error(
          "Có lỗi xảy ra: Vui lòng chọn phương thức thanh toán hợp lệ"
        );
      }
    }
  };

  const columns = [
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
              {record.optionValue.join(", ")}
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

  if (isLoading || sessionLoading) {
    return <LoadingPage />;
  }

  if (sessionError) {
    return <ErrorPage />;
  }

  if (session && session.user) {
    return (
      <PageWrapper style={{ paddingBottom: "4rem" }}>
        <Title level={2}>Thanh toán</Title>
        <div className={cx("cartPageWrapper")}>
          <Flex style={{ width: "100%" }} vertical>
            <Flex vertical className={cx("receiver-infor")}>
              <Title level={4}>Địa chỉ nhận hàng</Title>
              <Flex justify="space-between" align="center">
                <Space direction="vertical">
                  <Text strong>Tên: {name}</Text>
                  <Text strong>Số điện thoại: {phoneNumber}</Text>
                  <Text strong className={cx("receiver-infor-address")}>
                    Địa chỉ nhận hàng: {address}
                  </Text>
                </Space>
                <Button onClick={() => setOpen(true)}>Thay đổi</Button>
              </Flex>
            </Flex>
            <Flex justify="space-between">
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
                        <Radio value={PaymentMethod.CASH}>
                          Thanh toán khi nhận hàng
                        </Radio>
                        <Radio value={PaymentMethod.VNPAY}>
                          Cổng thanh toán VNPay
                        </Radio>
                      </Space>
                    </Radio.Group>
                  </Space>
                </Row>
                <Divider />
                <Row className={cx("totalRow")}>
                  <Flex
                    className={cx("note")}
                    justify="space-between"
                    align="center"
                  >
                    <Text className={cx("note-text")} strong>
                      Lời nhắn:
                    </Text>
                    <Input
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className={cx("note-input")}
                      placeholder="Lưu ý cho người bán..."
                    />
                  </Flex>
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
            </Flex>
          </Flex>
        </div>
        <OrderReceiverModal
          open={open}
          onSubmit={handleReceiverInfoChange}
          onCancel={() => setOpen(false)}
          receiverName={name}
          receiverAddress={address}
          receiverPhoneNumber={phoneNumber}
        />
      </PageWrapper>
    );
  }
};

export default CheckoutPage;
