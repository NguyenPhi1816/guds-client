import React, { useCallback, useState } from "react";
import { InputNumber, message, Radio, Select, Space, Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import _ from "lodash";
import { OrderBySearchParams } from "@/constant/enum/orderBySearchParams";

const { Option } = Select;
const { Text } = Typography;

interface ProductFilterProps {
  orderBy: string;
  onOrderByChange: (value: string) => void;
  onPriceRangeChange: (fromPrice: number, toPrice: number) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  orderBy,
  onOrderByChange,
  onPriceRangeChange,
}) => {
  const [fromPrice, setFromPrice] = useState<number | undefined>(undefined);
  const [toPrice, setToPrice] = useState<number | undefined>(undefined);

  // Debounce handler functions
  const debouncedSetPriceRange = useCallback(
    _.debounce((_fromPrice, _toPrice) => {
      if (_fromPrice !== undefined && _toPrice !== undefined) {
        if (_fromPrice <= _toPrice) {
          onPriceRangeChange(_fromPrice, _toPrice);
        } else {
          message.error("Giá trị không hợp lệ");
          return;
        }
      }
    }, 500),
    [onPriceRangeChange]
  );

  const handleFromPriceChange = (value: number | null) => {
    setFromPrice(value ?? 0);
    debouncedSetPriceRange(value ?? 0, toPrice);
  };

  const handleToPriceChange = (value: number | null) => {
    setToPrice(value ?? 0);
    debouncedSetPriceRange(fromPrice, value ?? 0);
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
            prefix={"₫"}
            min={0}
            style={{ width: "125px" }}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            value={fromPrice}
            onChange={handleFromPriceChange}
          />
          <MinusOutlined />
          <InputNumber
            size="large"
            placeholder="To"
            prefix={"₫"}
            min={0}
            style={{ width: "125px" }}
            disabled={!fromPrice}
            formatter={(value) =>
              value
                ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            value={toPrice}
            onChange={handleToPriceChange}
          />
        </Space>
      </Space>
    </div>
  );
};

export default ProductFilter;
