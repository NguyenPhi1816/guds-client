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
  name: string
): Promise<ProductVariant[]> => {
  try {
    const response = await fetch(`${api}/products/search/${name}`);
    const data: ProductVariant[] | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
