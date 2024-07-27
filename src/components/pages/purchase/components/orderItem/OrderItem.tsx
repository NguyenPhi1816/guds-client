import { OrderFull } from "@/types/order";
import styles from "./OrderItem.module.scss";
import classNames from "classnames/bind";
import React, { useState } from "react";
import { Button, Divider, Flex, Space, Typography } from "antd";
import { OrderStatus } from "@/constant/enum/orderStatus";
import { formatCurrency } from "@/formater/CurrencyFormater";
import ReviewModal from "../reviewModal";
import { ReviewModalType } from "../reviewModal/ReviewModal";
import useMessage from "antd/es/message/useMessage";

const cx = classNames.bind(styles);

const { Text } = Typography;

interface IOrderItem {
  data: OrderFull;
}

const OrderItem: React.FC<IOrderItem> = ({ data }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ReviewModalType>(
    data.orderDetails[0].review ? ReviewModalType.EDIT : ReviewModalType.CREATE
  );
  const [messageApi, contextHolder] = useMessage();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = (
    message?: string,
    messageType?: "error" | "success"
  ) => {
    if (message && messageType) {
      switch (messageType) {
        case "error": {
          messageApi.error(message);
          break;
        }
        case "success": {
          messageApi.success(message);
          break;
        }
      }
    }
    setShowModal(false);
  };

  return (
    <div className={cx("wrapper")}>
      <Flex justify="space-between">
        <Text strong>Mã đơn hàng: {data.id}</Text>
        <Text strong className={cx("status")}>
          {(() => {
            switch (data.status) {
              case OrderStatus.PENDING:
                return <>Đang chờ xác nhận</>;
              case OrderStatus.SHIPPING:
                return <>Đang giao hàng</>;
              case OrderStatus.SUCCESS:
                return <>Giao hàng thành công</>;
              case OrderStatus.SUCCESS:
                return <>Đã hủy</>;
              default: {
                return <>Không xác định</>;
              }
            }
          })()}
        </Text>
      </Flex>
      <Divider />
      {data.orderDetails.map((orderDetail) => (
        <div key={orderDetail.id}>
          <Flex
            align="center"
            key={orderDetail.id}
            className={cx("order-detail")}
          >
            <img
              className={cx("order-detail-image")}
              src={orderDetail.productImage}
              alt={orderDetail.productName}
            />
            <Space direction="vertical">
              <Text strong>{orderDetail.productName}</Text>
              <Text className={cx("order-detail-option-value")}>
                {orderDetail.optionValue.join(", ")}
              </Text>
            </Space>
            <Flex justify="center" style={{ flex: 1 }}>
              <Text>Số lượng: {orderDetail.quantity}</Text>
            </Flex>
            <Space>
              <Text>Đơn giá: {formatCurrency(orderDetail.price)}</Text>
            </Space>
          </Flex>
          <Divider />
        </div>
      ))}
      <Flex>
        <div style={{ flex: 1 }}></div>
        <Space>
          <Text strong className={cx("total")}>
            Tổng cộng:{" "}
            {formatCurrency(
              data.orderDetails.reduce(
                (prev, curr) => prev + curr.price * curr.quantity,
                0
              )
            )}
          </Text>
        </Space>
      </Flex>
      <Divider />
      <Flex justify="flex-end">
        <Space>
          {data.status === OrderStatus.PENDING && <Button>Hủy đơn hàng</Button>}
          {data.status === OrderStatus.SUCCESS &&
            data.orderDetails[0].review !== null && (
              <Button type="primary" onClick={handleShowModal}>
                Xem đánh giá
              </Button>
            )}
          {data.status === OrderStatus.SUCCESS &&
            data.orderDetails[0].review === null && (
              <Button type="primary" onClick={handleShowModal}>
                Đánh giá
              </Button>
            )}
        </Space>
      </Flex>
      <ReviewModal
        type={modalType}
        visible={showModal}
        onClose={handleCloseModal}
        data={data}
      />
      {contextHolder}
    </div>
  );
};

export default OrderItem;
