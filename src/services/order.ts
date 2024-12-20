"use server";
import { ErrorResponse } from "@/types/error";
import { getAccessToken } from "./auth";
import { api } from "./api";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderFull,
} from "@/types/order";
import { OrderStatus } from "@/constant/enum/orderStatus";

export const createOrder = async (
  createOrderRequest: CreateOrderRequest
): Promise<CreateOrderResponse> => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(`${api}/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "POST",
        body: JSON.stringify(createOrderRequest),
      });
      const result: CreateOrderResponse | ErrorResponse = await res.json();

      // if ("error" in result) {
      //   return { message: result.message, statusCode: result.statusCode };
      // }

      return result;
    } else {
      throw new Error("No session");
    }
  } catch (error) {
    throw error;
  }
};

export const getAllOrders = async (): Promise<OrderFull[]> => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(`${api}/orders/me`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "GET",
      });
      const result: OrderFull[] | ErrorResponse = await res.json();

      if ("error" in result) {
        throw new Error(result.message);
      }

      return result;
    } else {
      throw new Error("No session");
    }
  } catch (error) {
    throw error;
  }
};

export const cancelOrder = async (orderId: number): Promise<OrderFull> => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(
        `${api}/orders/${orderId}/${OrderStatus.CANCEL}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          method: "PUT",
        }
      );
      const result: OrderFull | ErrorResponse = await res.json();

      if ("error" in result) {
        throw new Error(result.message);
      }

      return result;
    } else {
      throw new Error("No session");
    }
  } catch (error) {
    throw error;
  }
};
