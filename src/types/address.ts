export type WhiteList = {
  From: number[] | null;
  To: number[] | null;
  Return: number[] | null;
};

export type Province = {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  IsEnable: number;
  RegionID: number;
  RegionCPN: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  CanUpdateCOD: boolean;
  Status: number;
};

export type District = {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Code: string;
  Type: number;
  SupportType: number;
  NameExtension: string[];
  IsEnable: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  CanUpdateCOD: boolean;
  Status: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: WhiteList;
  WhiteListDistrict: {
    From: null | number[];
    To: null | number[];
  };
  ReasonCode: string;
  ReasonMessage: string;
  OnDates: null | any;
  UpdatedEmployee: number;
  UpdatedDate: string;
};

export type Ward = {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  NameExtension: string[];
  IsEnable: number;
  CanUpdateCOD: boolean;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  SupportType: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: WhiteList;
  WhiteListWard: {
    From: null | number[];
    To: null | number[];
  };
  Status: number;
  ReasonCode: string;
  ReasonMessage: string;
  OnDates: string[] | null;
  UpdatedEmployee: number;
  UpdatedDate: string;
};

type DataType = Province[] | District[] | Ward[];

export interface AddressResponse<T extends DataType> {
  code: number;
  message: string;
  data: T;
}
