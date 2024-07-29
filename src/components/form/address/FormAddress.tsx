import React, { useState, useEffect } from "react";
import { Form, Select, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import { getProvince, getDistrict, getWard } from "@/services/address"; // Adjust path if needed
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
  const [stateInit, setStateInit] = useState<boolean>(false);

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
    ) {
      onChange([houseNumber, ward, district, province].join(", "));
    }
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
      setStateInit(true);
    };
    const timerId = setTimeout(() => fetcher(), 500);
    return () => clearTimeout(timerId);
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
        setDistrict(""); // Reset district and ward when province changes
        setWard("");
        return value;
      }
      return prev;
    });
  };

  const handleDistrictChange = (value: string) => {
    setDistrict((prev) => {
      if (prev !== value) {
        setWard(""); // Reset ward when district changes
        return value;
      }
      return prev;
    });
  };

  const handleWardChange = (value: string) => {
    setWard((prev) => (prev !== value ? value : prev));
  };

  const handleHouseNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHouseNumber(e.target.value);
  };

  return (
    stateInit && (
      <>
        <Form.Item
          initialValue={province}
          label="Tỉnh/Thành phố"
          name="province"
          rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
        >
          <Select
            onChange={handleProvinceChange}
            placeholder="Tỉnh/Thành phố"
            size="large"
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
        <Form.Item
          initialValue={district}
          label="Quận/Huyện"
          name="district"
          rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
        >
          <Select
            onChange={handleDistrictChange}
            placeholder="Quận/huyện"
            disabled={!province}
            size="large"
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
        <Form.Item
          initialValue={ward}
          label="Phường/Xã"
          name="ward"
          rules={[{ required: true, message: "Vui lòng chọn phường/xã!" }]}
        >
          <Select
            onChange={handleWardChange}
            placeholder="Phường/xã"
            disabled={!district}
            size="large"
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
        <Form.Item
          initialValue={houseNumber}
          label="Địa chỉ"
          name="houseNumber"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input
            onChange={handleHouseNumberChange}
            placeholder="Nhập số nhà, tên đường..."
            size="large"
          />
        </Form.Item>
      </>
    )
  );
};

export default FormAddress;
