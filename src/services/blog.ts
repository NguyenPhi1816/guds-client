"use server";
import { Blog, BlogCategory, BlogDetail } from "@/types/blog";
import { api } from "./api";
import { ErrorResponse } from "@/types/error";

export const getTopBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await fetch(`${api}/blogs/client/top-blogs`);
    const data: Blog[] | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getListCategoryBlogs = async (): Promise<BlogCategory[]> => {
  try {
    const response = await fetch(`${api}/blogs/client/list-category-blogs`);
    const data: BlogCategory[] | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getBlogsByCategoryId = async (
  categoryId: number
): Promise<BlogCategory> => {
  try {
    const response = await fetch(
      `${api}/blogs/client/category-blogs/${categoryId}`
    );
    const data: BlogCategory | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getBlogBySlug = async (slug: string): Promise<BlogDetail> => {
  try {
    const response = await fetch(`${api}/blogs/client/blog/${slug}`);
    const data: BlogDetail | ErrorResponse = await response.json();

    if ("error" in data) {
      throw new Error(data.message);
    }

    return data;
  } catch (error) {
    throw error;
  }
};
