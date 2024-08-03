import styles from "./OrderDetailModal.module.scss";
import classNames from "classnames/bind";

import { OrderStatus } from "@/constant/enum/orderStatus";
import { Order, OrderDetail, OrderFull } from "@/types/order";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
  Button,
  message,
  Modal,
  Descriptions,
  List,
  Card,
  Badge,
  Flex,
  Typography,
  Grid,
  Table,
  Divider,
} from "antd";
import React, { useEffect, useState } from "react";
import { formatDate } from "@/formater/DateFormater";
import { PaymentMethod } from "@/constant/enum/paymentMethod";
import { formatCurrency } from "@/formater/CurrencyFormater";
import { PaymentStatus } from "@/constant/enum/paymentStatus";

interface IOrderDetailModal {
  open: boolean;
  data: OrderFull;
  onCancel: () => void;
}

const cx = classNames.bind(styles);

const { Text, Title } = Typography;

const OrderDetailModal: React.FC<IOrderDetailModal> = ({
  open,
  data,
  onCancel,
}) => {
  const handleCancel = () => {
    onCancel();
  };

  return (
    data && (
      <Modal
        destroyOnClose={true}
        title="Chi tiết hóa đơn"
        open={open}
        onCancel={() => handleCancel()}
        width={"70%"}
        footer={[
          <Button onClick={() => handleCancel()} key="1">
            Đóng
          </Button>,
        ]}
      >
        <Descriptions
          title="Thông tin đơn hàng"
          bordered
          size="small"
          layout="vertical"
        >
          <Descriptions.Item label="Mã đơn hàng">{data.id}</Descriptions.Item>
          <Descriptions.Item label="Người đặt">
            {data.userName}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {formatDate(data.createAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Người nhận">
            {data.receiverName}
          </Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">
            {data.receiverPhoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Ghi chú" contentStyle={{ fontWeight: 700 }}>
            {data.note}
          </Descriptions.Item>
          <Descriptions.Item
            label="Trạng thái"
            contentStyle={{ fontWeight: 700 }}
          >
            {(() => {
              switch (data.status) {
                case OrderStatus.PENDING:
                  return "Đang chờ xác nhận";
                case OrderStatus.SHIPPING:
                  return "Đang giao hàng";
                case OrderStatus.SUCCESS:
                  return "Giao hàng thành công";
                case OrderStatus.CANCEL:
                  return "Đơn hàng đã hủy";
                default:
                  return "Không xác định";
              }
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">
            {data.receiverAddress}
          </Descriptions.Item>
        </Descriptions>

        <Title level={5} className={cx("title")}>
          Sản phẩm
        </Title>
        <div className={cx("product")}>
          <Flex className={cx("header")}>
            <div className={cx("var-1")}>
              <Flex justify="start">
                <div className={cx("space")}></div>
                <Text strong>Sản phẩm</Text>
              </Flex>
            </div>
            <div className={cx("var-2")}>
              <Flex justify="center">
                <Text strong>Số lượng</Text>
              </Flex>
            </div>
            <div className={cx("var-3")}>
              <Flex justify="center">
                <Text strong>Đơn giá</Text>
              </Flex>
            </div>
            <div className={cx("var-4")}>
              <Flex justify="center">
                <Text strong>Thành tiền</Text>
              </Flex>
            </div>
          </Flex>
          <Divider />
          <List
            dataSource={data.orderDetails}
            renderItem={(item) => (
              <>
                <List.Item key={item.id}>
                  <div className={cx("var-1")}>
                    <List.Item.Meta
                      title={item.productName}
                      avatar={
                        <img
                          width={100}
                          alt="product"
                          src={item.productImage}
                        />
                      }
                      description={`Option: ${item.optionValue.join(", ")}`}
                    />
                  </div>
                  <div className={cx("var-2")}>
                    <Flex justify="center">{item.quantity}</Flex>
                  </div>
                  <div className={cx("var-3")}>
                    <Flex justify="center">{formatCurrency(item.price)}</Flex>
                  </div>
                  <div className={cx("var-4")}>
                    <Flex justify="center">
                      {formatCurrency(item.price * item.quantity)}
                    </Flex>
                  </div>
                </List.Item>
              </>
            )}
          />
        </div>

        <Descriptions
          title="Thông tin thanh toán"
          bordered
          layout="vertical"
          size="small"
        >
          <Descriptions.Item label="Phương thức thanh toán">
            {(() => {
              switch (data.payment.paymentMethod) {
                case PaymentMethod.CASH:
                  return "Tiền mặt";
                case PaymentMethod.VNPAY:
                  return "Ví VNPay";
                default:
                  return "Không xác định";
              }
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="Tổng giá">
            {formatCurrency(data.payment.totalPrice)}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {(() => {
              switch (data.payment.status) {
                case PaymentStatus.PENDING:
                  return "Đang chờ thanh toán";
                case PaymentStatus.CANCEL:
                  return "Đã hủy";
                case PaymentStatus.SUCCESS:
                  return "Đã thanh toán";
                case PaymentStatus.REFUND:
                  return "Đã hoàn tiền";
                default:
                  return "Không xác định";
              }
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày thanh toán">
            {data.payment.paymentDate
              ? formatDate(data.payment.paymentDate)
              : "Chưa thanh toán"}
          </Descriptions.Item>
          <Descriptions.Item label="Mã giao dịch (nếu có)">
            {data.payment.paymentMethod !== PaymentMethod.CASH
              ? data.payment.transactionId
                ? data.payment.transactionId
                : "Chưa thanh toán"
              : "Thanh toán bằng tiền mặt"}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    )
  );
};

export default OrderDetailModal;
