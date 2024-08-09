"use server";

import { api } from "./api";
import { ErrorResponse } from "@/types/error";
import { BaseProduct, ProductVariant } from "@/types/product";

export const getProductBySlug = async (slug: string): Promise<BaseProduct> => {
  console.log(slug);

  try {
    const response = await fetch(`${api}/products/${slug}`);
    const data: BaseProduct | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const searchProductByName = async (
  name: string,
  orderBy: string,
  page: number = 1,
  limit: number = 20,
  fromPrice?: number,
  toPrice?: number
): Promise<ProductVariant[]> => {
  try {
    console.log(fromPrice !== undefined && toPrice !== undefined);

    const response = await fetch(
      `${api}/products/search/${name}?sortBy=${orderBy}&page=${page}&limit=${limit}${
        fromPrice !== undefined && toPrice !== undefined
          ? "&fromPrice=" + fromPrice + "&toPrice=" + toPrice
          : ""
      }`
    );
    const data: ProductVariant[] | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
