import { UserGender } from "@/constant/enum/userGender";

export type LoginRequest = {
  phoneNumber: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
};

export type SignUpRequest = {
  email: string;
  address: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  password: string;
  dateOfBirth: string;
  gender: UserGender;
};

export type SignUpResponse = {
  code: 201;
  message: string;
};

export type RefreshTokenResponse = {
  access_token: string;
};
