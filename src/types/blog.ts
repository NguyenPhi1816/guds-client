export type Blog = {
  id: number;
  title: string;
  image: string;
  summary: string;
  createAt: string;
  slug: string;
};

export type BlogCategory = {
  id: number;
  name: string;
  description: string;
  createAt: string;
  image: string;
  imageId: string;
  blogs: Blog[];
};

export type BlogDetail = {
  id: number;
  title: string;
  content: string;
  image: string;
  imageId: string;
  summary: string;
  createAt: string;
  updateAt: string;
  status: "ACTIVE" | "INACTIVE";
  slug: string;
  author: string;
};
