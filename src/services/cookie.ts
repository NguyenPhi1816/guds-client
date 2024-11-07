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
  console.log(JSON.stringify(product));

  try {
    const res = await fetch("/api/cookie/favorite-products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product }), // Include product in body
    });
    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
