import { Discount } from "./product";

export type BrandProduct = {
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

export type Brand = {
  id: number;
  slug: string;
  name: string;
  image: string;
  products: BrandProduct[];
};
