import { CategoryProduct } from "./category";
import { ProductVariant } from "./product";

export type FavoriteProductsResponse = {
  ok: boolean;
  data: (CategoryProduct | ProductVariant)[];
};
