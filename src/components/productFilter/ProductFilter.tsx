import React, { useCallback } from "react";
import { InputNumber, Radio, Select, Space, Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import _ from "lodash";
import { OrderBySearchParams } from "@/constant/enum/orderBySearchParams";

const { Option } = Select;
const { Text } = Typography;

interface ProductFilterProps {
  fromPrice: number | undefined;
  toPrice: number | undefined;
  orderBy: string;
  onFromPriceChange: (value: number | undefined) => void;
  onToPriceChange: (value: number | undefined) => void;
  onOrderByChange: (value: string) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  fromPrice,
  toPrice,
  orderBy,
  onFromPriceChange,
  onToPriceChange,
  onOrderByChange,
}) => {
  // Debounce handler functions
  const debouncedSetFromPrice = useCallback(
    _.debounce((value) => onFromPriceChange(value), 300),
    [onFromPriceChange]
  );

  const debouncedSetToPrice = useCallback(
    _.debounce((value) => onToPriceChange(value), 300),
    [onToPriceChange]
  );

  const handleFromPriceChange = (value: number | null) => {
    if (!toPrice) {
      onToPriceChange(0);
    }
    debouncedSetFromPrice(value ?? 0);
  };

  const handleToPriceChange = (value: number | null) => {
    if (!fromPrice) {
      onFromPriceChange(0);
    }
    debouncedSetToPrice(value ?? 0);
  };

  return (
    <div
      style={{
        marginBottom: "1rem",
        padding: "1rem",
        backgroundColor: "var(--light-grey)",
        borderRadius: "0.5rem",
      }}
    >
      <Space size={"large"} align="center">
        <Text style={{ fontSize: "1rem" }} strong>
          Sắp xếp theo
        </Text>
        <Radio.Group
          size="large"
          onChange={(e) => onOrderByChange(e.target.value)}
          value={orderBy ?? undefined}
        >
          <Radio.Button value={OrderBySearchParams.BEST_SELLING}>
            Bán chạy
          </Radio.Button>
        </Radio.Group>
        <Select
          size="large"
          style={{ width: "200px" }}
          placeholder="Giá sản phẩm"
          onChange={(value) => onOrderByChange(value)}
          value={
            orderBy === OrderBySearchParams.PRICE_DESC ||
            orderBy === OrderBySearchParams.PRICE_ASC
              ? orderBy
              : undefined
          }
        >
          <Option value={OrderBySearchParams.PRICE_DESC}>
            Giá: Cao đến thấp
          </Option>
          <Option value={OrderBySearchParams.PRICE_ASC}>
            Giá: Thấp đến cao
          </Option>
        </Select>
        <Space align="center">
          <Text>Khoảng giá</Text>
          <InputNumber
            size="large"
            placeholder="From"
            defaultValue={fromPrice}
            prefix={"₫"}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "0"
            }
            min={0}
            style={{ width: "125px" }}
            onChange={handleFromPriceChange}
          />
          <MinusOutlined />
          <InputNumber
            size="large"
            placeholder="To"
            defaultValue={toPrice}
            prefix={"₫"}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : "0"
            }
            min={0}
            style={{ width: "125px" }}
            onChange={handleToPriceChange}
          />
        </Space>
      </Space>
    </div>
  );
};

export default ProductFilter;
