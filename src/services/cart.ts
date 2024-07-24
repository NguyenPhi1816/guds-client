"use server";
import { ErrorResponse } from "@/types/error";
import { api } from "./api";
import { getAccessToken } from "./auth";
import { Cart } from "@/types/cart";

export const getCart = async (): Promise<Cart[]> => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(`${api}/carts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "GET",
      });
      const result: Cart[] | ErrorResponse = await res.json();

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

export const addProductToCart = async (
  productVariantId: number,
  quantity: number
): Promise<Cart[]> => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(`${api}/carts`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "POST",
        body: JSON.stringify({ productVariantId, quantity }),
      });
      const result: Cart[] | ErrorResponse = await res.json();

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
