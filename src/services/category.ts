"use server";
import { CategoryResponse } from "@/types/category";
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
