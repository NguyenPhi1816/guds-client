export type ReviewCustomer = {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
};

export type Review = {
  id: number;
  comment: string;
  createdAt: string;
  customer: ReviewCustomer;
  rating: number;
  variant: string;
};

export type ReviewResponse = {
  reviews: Review[];
  numberOfReviews: number;
};
