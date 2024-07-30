import { AccountStatus } from "@/constant/enum/accountStatus";

export type ProfileResponse = {
  id: number;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  image: string | null;
  email: string;
  status: string;
  role: string;
};

export type UpdateProfileRequest = {
  email: string;
  address: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  image: string | null;
};
