"use server";
import {
  CategoryBySlugResponse,
  CategoryProduct,
  CategoryResponse,
} from "@/types/category";
import { api } from "./api";
import { ErrorResponse } from "@/types/error";

export const getAllCategories = async (): Promise<CategoryResponse[]> => {
  try {
    const response = await fetch(`${api}/categories/client`);
    const data: CategoryResponse[] | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getCategoryBySlug = async (
  slug: string,
  orderBy: string,
  page: number = 1,
  limit: number = 20,
  fromPrice?: number,
  toPrice?: number
): Promise<CategoryBySlugResponse> => {
  try {
    const response = await fetch(
      `${api}/categories/${slug}?orderBy=${orderBy}&page=${page}&limit=${limit}${
        fromPrice !== undefined && toPrice !== undefined
          ? "&fromPrice=" + fromPrice + "&toPrice=" + toPrice
          : ""
      }`
    );
    const data: CategoryBySlugResponse | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getBaseProductByCategorySlug = async (
  slug: string,
  orderBy: string,
  page: number = 1,
  limit: number = 20,
  fromPrice?: number,
  toPrice?: number
): Promise<CategoryProduct[]> => {
  try {
    const response = await fetch(
      `${api}/products/category/${slug}?orderBy=${orderBy}&page=${page}&limit=${limit}${
        fromPrice !== undefined && toPrice !== undefined
          ? "&fromPrice=" + fromPrice + "&toPrice=" + toPrice
          : ""
      }`
    );
    const data: CategoryProduct[] | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
