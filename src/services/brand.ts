"use server";
import { Brand, BrandProduct } from "@/types/brand";
import { ErrorResponse } from "@/types/error";
import { api } from "./api";

export const getBrandBySlug = async (
  slug: string,
  orderBy: string,
  page: number = 1,
  limit: number = 20,
  fromPrice?: number,
  toPrice?: number
): Promise<Brand> => {
  try {
    const response = await fetch(
      `${api}/brands/${slug}?orderBy=${orderBy}&page=${page}&limit=${limit}${
        fromPrice !== undefined && toPrice !== undefined
          ? "&fromPrice=" + fromPrice + "&toPrice=" + toPrice
          : ""
      }`
    );
    const data: Brand | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getProductsByBrandSlug = async (
  slug: string,
  orderBy: string,
  page: number = 1,
  limit: number = 20,
  fromPrice?: number,
  toPrice?: number
): Promise<BrandProduct[]> => {
  try {
    const response = await fetch(
      `${api}/products/brand/${slug}?orderBy=${orderBy}&page=${page}&limit=${limit}${
        fromPrice !== undefined && toPrice !== undefined
          ? "&fromPrice=" + fromPrice + "&toPrice=" + toPrice
          : ""
      }`
    );
    const data: BrandProduct[] | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
