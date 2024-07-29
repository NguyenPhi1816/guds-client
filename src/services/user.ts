"use server";
import { ProfileResponse } from "@/types/user";
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

    if ("error" in profile) {
      throw new Error(profile.message);
    }

    return profile ?? null;
  } catch (error) {
    throw error;
  }
};
