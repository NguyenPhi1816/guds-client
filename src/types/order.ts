import { OrderStatus } from "@/constant/enum/orderStatus";
import { PaymentMethod } from "@/constant/enum/paymentMethod";
import { PaymentStatus } from "@/constant/enum/paymentStatus";

export type Order = {
  id: number;
  userId: number;
  receiverName: string;
  receiverPhoneNumber: string;
  receiverAddress: string;
  note: string;
  createAt: string;
  status: OrderStatus;
};

export type OrderDetail = {
  id: number;
  productVariantId: number;
  quantity: number;
  price: number;
};

export type OrderPayment = {
  id: number;
  paymentMethod: PaymentMethod;
  paymentDate: string | null;
  totalPrice: number;
  status: PaymentStatus;
  transactionId: string | null;
};

export type CreateOrderResponse = {
  order: Order;
  orderDetails: OrderDetail[];
  payment: OrderPayment;
};

export type OrderDetailRequest = {
  productVariantId: number;
  quantity: number;
};

export type CreateOrderRequest = {
  note: string | null;
  paymentMethod: PaymentMethod;
  paymentDate: string | null;
  transactionId: string | null;
  orderDetails: OrderDetailRequest[];
  receiverName: string;
  receiverPhoneNumber: string;
  receiverAddress: string;
};
