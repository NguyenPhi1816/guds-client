import { CategoryProduct } from "@/types/category";
import { FavoriteProductsResponse } from "@/types/cookie";
import { ProductVariant } from "@/types/product";
import { getAccessToken } from "./auth";
import { ErrorResponse } from "@/types/error";
import { BrandProduct } from "@/types/brand";

export const getFavoriteProducts = async () => {
  try {
    const res = await fetch("/api/cookie/favorite-products", {
      method: "GET",
    });
    const data: FavoriteProductsResponse = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const setFavoriteProducts = async (
  product: CategoryProduct | ProductVariant | BrandProduct
) => {
  try {
    const res = await fetch("/api/cookie/favorite-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }), // Include product in body
    });
    const data = await res.json();

    const accessToken = await getAccessToken();
    if (accessToken) {
      console.log(product.id, product.categoryIds);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GUDS_API}/users/save-user-activity`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
          },
          method: "POST",
          body: JSON.stringify({
            baseProductId: product.id,
            categoryIds: product.categoryIds,
            activityType: "FAVORITE",
          }),
        }
      );
      const result: any | ErrorResponse = await res.json();

      if ("error" in result) {
        throw new Error(result.message);
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
};
