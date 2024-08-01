import { CategoryProduct } from "@/types/category";
import { FavoriteProductsResponse } from "@/types/cookie";
import { ProductVariant } from "@/types/product";

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
  product: CategoryProduct | ProductVariant
) => {
  try {
    const res = await fetch("/api/cookie/favorite-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        product: JSON.stringify(product),
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
