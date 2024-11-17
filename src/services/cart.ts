"use server";
import { ErrorResponse } from "@/types/error";
import { api } from "./api";
import { getAccessToken } from "./auth";
import { Cart, ExtendedCart } from "@/types/cart";
import { CartQuantityUpdateType } from "@/constant/enum/cartQuantityUpdateType";

export const getCart = async (): Promise<ExtendedCart[]> => {
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
      const result: ExtendedCart[] | ErrorResponse = await res.json();

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
  quantity: number,
  baseProductId: number,
  categoryIds: number[]
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
        body: JSON.stringify({
          productVariantId,
          quantity,
          baseProductId,
          categoryIds,
        }),
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

export const updateCartQuantity = async (
  productVariantId: number,
  quantity: number,
  type: CartQuantityUpdateType
) => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(`${api}/carts/${productVariantId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "PATCH",
        body: JSON.stringify({ type, quantity }),
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

export const deleteCart = async (productVariantId: number) => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(`${api}/carts/${productVariantId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "DELETE",
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
