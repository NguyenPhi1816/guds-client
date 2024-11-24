import category from "@/components/pages/category";
import { Discount } from "./product";

export type Category = {
  id: number;
  slug: string;
  name: string;
  image: string;
};

export type CategoryProduct = {
  id: number;
  categoryIds: number[];
  slug: string;
  name: string;
  variantId: number;
  image: string;
  price: number;
  averageRating: number;
  numberOfReviews: number;
  numberOfPurchases: number;
  discount: Discount;
};

export interface CategoryResponse extends Category {
  children: Category[];
  products: CategoryProduct[];
}

export interface CategoryBySlugResponse extends Category {
  description: string;
  parent: Category | null;
  products: CategoryProduct[];
}
