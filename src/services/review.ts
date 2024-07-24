"use server";
import { Review } from "@/types/review";
import { api } from "./api";
import { ErrorResponse } from "@/types/error";

export const getReviewsByBaseProductSlug = async (
  slug: string
): Promise<Review[]> => {
  try {
    const res = await fetch(`${api}/reviews/${slug}`);
    const data: Review[] | ErrorResponse = await res.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
