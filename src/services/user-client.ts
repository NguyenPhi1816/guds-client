import { ProfileResponse, UpdateProfileRequest } from "@/types/user";
import { getAccessToken } from "./auth";
import { ErrorResponse } from "@/types/error";

export const updateProfile = async (requestBody: UpdateProfileRequest) => {
  try {
    const myAccessToken = await getAccessToken();

    if (!myAccessToken) {
      throw new Error("Có lỗi xảy ra trong quá trình cập nhật tin người dùng");
    }

    const formData = new FormData();
    formData.append("email", requestBody.email);
    formData.append("address", requestBody.address);
    formData.append("phoneNumber", requestBody.phoneNumber);
    formData.append("firstName", requestBody.firstName);
    formData.append("lastName", requestBody.lastName);
    formData.append("dateOfBirth", requestBody.dateOfBirth);
    formData.append("gender", requestBody.gender);
    if (requestBody.imageUrl && requestBody.imageId) {
      formData.append("imageUrl", requestBody.imageUrl);
      formData.append("imageId", requestBody.imageId);
    }
    if (requestBody.image) {
      formData.append("image", requestBody.image);
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_GUDS_API}/users/`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + myAccessToken,
      },
      body: formData,
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
