"use server";
import { ErrorResponse } from "@/types/error";
import { getAccessToken } from "./auth";
import { api } from "./api";
import { CreateOrderRequest, CreateOrderResponse } from "@/types/order";

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
