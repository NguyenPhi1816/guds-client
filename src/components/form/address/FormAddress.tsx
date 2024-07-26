import React, { useState, useEffect } from "react";
import { Form, Select, Input } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProvince, getDistrict, getWard } from "@/services/address"; // Điều chỉnh đường dẫn nếu cần
import { AddressResponse, District, Province, Ward } from "@/types/address";

const { Option } = Select;

interface FormAddressProps {
  defaultValue?: string;
  onChange: (address: string) => void;
}

const FormAddress: React.FC<FormAddressProps> = ({
  defaultValue = "",
  onChange,
}) => {
  const [provinceData, setProvinceData] = useState<AddressResponse<
    Province[]
  > | null>(null);
  const [districtData, setDistrictData] = useState<AddressResponse<
    District[]
  > | null>(null);
  const [wardData, setWardData] = useState<AddressResponse<Ward[]> | null>(
    null
  );
  const [province, setProvince] = useState<string>("");
  const [district, setDistrict] = useState<string>("");
  const [ward, setWard] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");

  // Fetch provinces using React Query
  const provinceMutation = useMutation({
    mutationKey: ["province"],
    mutationFn: async () => await getProvince(),
    onSuccess: (data) => setProvinceData(data),
  });

  // Fetch districts when a city is selected
  const districtMutation = useMutation({
    mutationKey: ["district"],
    mutationFn: async (provinceId: number) => await getDistrict(provinceId),
    onSuccess: (data) => setDistrictData(data),
  });

  // Fetch wards when a district is selected
  const wardMutation = useMutation({
    mutationKey: ["ward"],
    mutationFn: async (districtId: number) => await getWard(districtId),
    onSuccess: (data) => setWardData(data),
  });

  useEffect(() => {
    if (
      !!houseNumber &&
      !!ward &&
      !!district &&
      !!province &&
      [houseNumber, ward, district, province].join(", ") !== defaultValue
    )
      onChange([houseNumber, ward, district, province].join(", "));
  }, [houseNumber, ward, district, province]);

  useEffect(() => {
    const fetcher = async () => {
      if (defaultValue) {
        const parts = defaultValue.split(", ").map((part) => part.trim());
        setProvince(parts[3]);
        setDistrict(parts[2]);
        setWard(parts[1]);
        setHouseNumber(parts[0]);
      }
    };
    fetcher();
  }, [defaultValue]);

  useEffect(() => handleLoadProvince(), []);

  useEffect(() => {
    if (province) {
      handleLoadDistrict(province);
    }
  }, [province, provinceData]);

  useEffect(() => {
    if (district) {
      handleLoadWard(district);
    }
  }, [district, districtData]);

  const handleLoadProvince = () => provinceMutation.mutate();

  const handleLoadDistrict = (provinceName: string) => {
    if (provinceData && provinceData.data) {
      const _province = provinceData.data.find(
        (item) => item.ProvinceName === provinceName
      );
      if (_province) {
        districtMutation.mutate(_province.ProvinceID);
      }
    }
  };

  const handleLoadWard = (districtName: string) => {
    if (districtData && districtData.data) {
      const _district = districtData.data.find(
        (item) => item.DistrictName === districtName
      );
      if (_district) {
        wardMutation.mutate(_district.DistrictID);
      }
    }
  };

  const handleProvinceChange = (value: string) => {
    setProvince((prev) => {
      if (prev !== value) {
        return value;
      }
      return prev;
    });
  };

  const handleDistrictChange = (value: string) => {
    setDistrict((prev) => {
      if (prev !== value) {
        return value;
      }
      return prev;
    });
  };

  const handleWardChange = (value: string) => {
    setWard((prev) => {
      if (prev !== value) {
        return value;
      }
      return prev;
    });
  };

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHouseNumber(value);
  };

  return (
    <>
      <Form.Item label="Thành phố">
        <Select
          value={province}
          onChange={handleProvinceChange}
          placeholder="Tỉnh/Thành phố"
        >
          {provinceData &&
            provinceData.data &&
            provinceData.data.map((province) => (
              <Option
                key={(province as Province).ProvinceID}
                value={(province as Province).ProvinceName}
              >
                {(province as Province).ProvinceName}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="Quận/Huyện">
        <Select
          value={district}
          onChange={handleDistrictChange}
          placeholder="Quận/huyện"
          disabled={!province}
        >
          {districtData &&
            districtData.data &&
            districtData.data.map((district) => (
              <Option
                key={(district as District).DistrictID}
                value={(district as District).DistrictName}
              >
                {(district as District).DistrictName}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="Phường/Xã">
        <Select
          value={ward}
          onChange={handleWardChange}
          placeholder="Phường/xã"
          disabled={!district}
        >
          {wardData &&
            wardData.data &&
            wardData.data.map((ward) => (
              <Option
                key={(ward as Ward).WardCode}
                value={(ward as Ward).WardName}
              >
                {(ward as Ward).WardName}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item label="Địa chỉ">
        <Input
          value={houseNumber}
          onChange={handleHouseNumberChange}
          placeholder="Nhập số nhà, tên đường..."
        />
      </Form.Item>
    </>
  );
};

export default FormAddress;
