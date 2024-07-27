"use server";
import { Brand } from "@/types/brand";
import { ErrorResponse } from "@/types/error";
import { api } from "./api";

export const getBrandBySlug = async (slug: string): Promise<Brand> => {
  try {
    const response = await fetch(`${api}/brands/${slug}`);
    const data: Brand | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
