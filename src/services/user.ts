"use server";
import { ProfileResponse, UpdateProfileRequest } from "@/types/user";
import { api } from "./api";
import { ErrorResponse } from "@/types/error";
import { getAccessToken } from "./auth";

export const getProfile = async (accessToken?: string) => {
  try {
    const myAccessToken = accessToken ? accessToken : await getAccessToken();

    if (!myAccessToken) {
      throw new Error("Có lỗi xảy ra trong quá trình lấy thông tin người dùng");
    }

    const res = await fetch(`${api}/users/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myAccessToken,
      },
    });
    const profile: ProfileResponse | ErrorResponse = await res.json();

    console.log(profile);

    if ("error" in profile) {
      throw new Error(profile.message);
    }

    return profile ?? null;
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (requestBody: UpdateProfileRequest) => {
  try {
    const myAccessToken = await getAccessToken();

    if (!myAccessToken) {
      throw new Error("Có lỗi xảy ra trong quá trình cập nhật tin người dùng");
    }

    const res = await fetch(`${api}/users/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + myAccessToken,
      },
      body: JSON.stringify(requestBody),
    });
    const profile: ProfileResponse | ErrorResponse = await res.json();

    if ("error" in profile) {
      throw new Error(profile.message);
    }

    return profile;
  } catch (error) {
    throw error;
  }
};

export const getUserSearchRecommend = async () => {
  try {
    let fetcher = fetch(`${api}/users/get-user-search-recommend`, {
      method: "GET",
    });

    const myAccessToken = await getAccessToken();
    if (myAccessToken) {
      fetcher = fetch(`${api}/users/get-user-search-recommend`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + myAccessToken,
        },
      });
    }

    const res = await fetcher;

    const result:
      | { history: string[]; popularKeywords: string[] }
      | ErrorResponse = await res.json();

    if ("error" in result) {
      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    throw error;
  }
};

export const getRelatedSearchKeyword = async (keyword: string) => {
  try {
    const res = await fetch(
      `${api}/users/get-related-search-keywords?q=${keyword}`,
      {
        method: "GET",
      }
    );

    const result: string[] | ErrorResponse = await res.json();

    if ("error" in result) {
      throw new Error(result.message);
    }

    const response = {
      history: [],
      popularKeywords: result,
    };

    return response;
  } catch (error) {
    throw error;
  }
};
