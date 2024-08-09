import { OrderFull } from "@/types/order";
import styles from "./OrderItem.module.scss";
import classNames from "classnames/bind";
import React, { useState } from "react";
import { Button, Divider, Flex, Modal, Space, Typography } from "antd";
import { OrderStatus } from "@/constant/enum/orderStatus";
import { formatCurrency } from "@/formater/CurrencyFormater";
import ReviewModal from "../reviewModal";
import { ReviewModalType } from "../reviewModal/ReviewModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/services/order";
import { ORDERS_QUERY_KEY } from "@/services/queryKeys";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";
import { ExclamationCircleFilled } from "@ant-design/icons";
import OrderDetailModal from "../orderDetailModal";

const cx = classNames.bind(styles);

const { Text } = Typography;
const { confirm } = Modal;

interface IOrderItem {
  data: OrderFull;
}

const OrderItem: React.FC<IOrderItem> = ({ data }) => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<ReviewModalType>(
    data.orderDetails[0].review ? ReviewModalType.EDIT : ReviewModalType.CREATE
  );
  const message = useGlobalMessage();

  const cancelMutation = useMutation({
    mutationFn: () => cancelOrder(data.id),
    onSuccess: () => {
      message.success("Hủy đơn hàng thành công");
      queryClient.invalidateQueries({ queryKey: [ORDERS_QUERY_KEY] });
    },
    onError: (error) => message.error(error.message),
  });

  const handleShowModal = () => {
    setModalType(
      data.orderDetails[0].review
        ? ReviewModalType.EDIT
        : ReviewModalType.CREATE
    );
    setShowModal(true);
  };

  const handleShowDetailModal = () => {
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  const handleCloseModal = (
    _message?: string,
    messageType?: "error" | "success"
  ) => {
    if (_message && messageType) {
      switch (messageType) {
        case "error": {
          message.error(_message);
          break;
        }
        case "success": {
          message.success(_message);
          break;
        }
      }
    }
    setShowModal(false);
  };

  const handleCancelOrder = () => {
    confirm({
      title: "Hủy đơn hàng",
      icon: <ExclamationCircleFilled />,
      content: "Bạn chắc chắn muốn hủy đơn hàng này chứ?",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        cancelMutation.mutate();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
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
              case OrderStatus.CANCEL:
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
            <Space direction="vertical" className={cx("order-detail-name")}>
              <Text strong ellipsis>
                {orderDetail.productName}
              </Text>
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
          {data.status === OrderStatus.PENDING && (
            <Button onClick={handleCancelOrder}>Hủy đơn hàng</Button>
          )}
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
          <Button type="primary" onClick={handleShowDetailModal}>
            Chi tiết
          </Button>
        </Space>
      </Flex>
      <ReviewModal
        type={modalType}
        visible={showModal}
        onClose={handleCloseModal}
        data={data}
      />
      <OrderDetailModal
        data={data}
        open={showDetailModal}
        onCancel={handleCloseDetailModal}
      />
    </div>
  );
};

export default OrderItem;
