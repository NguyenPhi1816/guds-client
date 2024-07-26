"use server";
import { ErrorResponse } from "@/types/error";
import { getAccessToken } from "./auth";
import { api } from "./api";

export const createVNPayPaymentURL = async (
  amount: number,
  orderId: number,
  orderDescription: string
): Promise<any> => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(`${api}/vnpay/create_payment_url`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "POST",
        body: JSON.stringify({ amount, orderId, orderDescription }),
      });
      const result: any | ErrorResponse = await res.json();

      if ("error" in result) {
        throw new Error(result.message);
      }

      return result;
    } else {
      return [];
    }
  } catch (error) {
    throw error;
  }
};
