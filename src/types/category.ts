import category from "@/components/pages/category";

export type Category = {
  id: number;
  slug: string;
  name: string;
  image: string;
};

export type CategoryProduct = {
  id: number;
  slug: string;
  name: string;
  variantId: number;
  image: string;
  price: number;
  averageRating: number;
  numberOfReviews: number;
  numberOfPurchases: number;
};

export interface CategoryResponse extends Category {
  children: Category[];
  products: CategoryProduct[];
}

export interface CategoryBySlugResponse extends Category {
  description: string;
  products: CategoryProduct[];
}
