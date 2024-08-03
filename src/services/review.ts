"use server";
import { Review } from "@/types/review";
import { api } from "./api";
import { ErrorResponse } from "@/types/error";
import { getAccessToken } from "./auth";

export const createReview = async (
  orderId: number,
  rating: number,
  comment: string | null
) => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      let request = { orderId, rating, comment };

      const res = await fetch(`${api}/reviews`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "POST",
        body: JSON.stringify(request),
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

export const updateReview = async (
  reviewId: number,
  rating: number,
  comment: string | null
) => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(`${api}/reviews`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "PUT",
        body: JSON.stringify({ reviewId, rating, comment }),
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

export const deleteReview = async (reviewId: number) => {
  try {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const res = await fetch(`${api}/reviews/${reviewId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        method: "DELETE",
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

export const getReviewsByBaseProductSlug = async (
  slug: string,
  queryParam: string
): Promise<Review[]> => {
  try {
    const res = await fetch(`${api}/reviews/${slug}${queryParam}`);
    const data: Review[] | ErrorResponse = await res.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
