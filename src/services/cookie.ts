import { FavoriteProductsResponse } from "@/types/cookie";

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

export const setFavoriteProducts = async (productId: number) => {
  try {
    const res = await fetch("/api/cookie/favorite-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        productId: JSON.stringify(productId),
      },
    });
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
