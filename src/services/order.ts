"use server";
import { ErrorResponse } from "@/types/error";
import { getAccessToken } from "./auth";
import { api } from "./api";
import {
  CreateOrderRequest,
  CreateOrderResponse,
  OrderFull,
} from "@/types/order";

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
