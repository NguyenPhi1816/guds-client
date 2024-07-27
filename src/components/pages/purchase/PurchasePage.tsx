"use client";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { OrderStatus } from "@/constant/enum/orderStatus";
import { getAllOrders } from "@/services/order";
import { ORDERS_QUERY_KEY } from "@/services/queryKeys";
import { CloseCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import {
  Empty,
  Flex,
  Input,
  Space,
  Spin,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import OrderItem from "./components/orderItem/OrderItem";
import Search from "antd/es/transfer/search";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { OrderFull } from "@/types/order";

const { Text } = Typography;

const EmptyTab = () => (
  <div
    style={{
      height: "60vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Empty description="Chưa có đơn hàng" />
  </div>
);

const PurchasePage = () => {
  const [searchResult, setSearchResult] = useState<OrderFull[]>([]);
  const [items, setItems] = useState<TabsProps["items"]>([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: [ORDERS_QUERY_KEY],
    queryFn: async () => await getAllOrders(),
  });

  useEffect(() => {
    if (data) {
      setSearchResult(data);
    }
  }, [data]);

  useEffect(() => {
    const items: TabsProps["items"] = [
      {
        key: "all",
        label: "Tất cả",
        children: (() => {
          if (!searchResult) {
            return <EmptyTab />;
          }
          const children = searchResult.sort(
            (a, b) => Date.parse(b.createAt) - Date.parse(a.createAt)
          );
          if (children.length === 0) {
            return <EmptyTab />;
          }
          return children.map((item) => (
            <OrderItem key={item.id} data={item} />
          ));
        })(),
      },
      {
        key: OrderStatus.PENDING,
        label: "Đang chờ",
        children: (() => {
          if (!searchResult) {
            return <EmptyTab />;
          }
          const children = searchResult
            .filter((item) => item.status === OrderStatus.PENDING)
            .sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt));
          if (children.length === 0) {
            return <EmptyTab />;
          }
          return children.map((item) => (
            <OrderItem key={item.id} data={item} />
          ));
        })(),
      },
      {
        key: OrderStatus.SHIPPING,
        label: "Đang vận chuyển",
        children: (() => {
          if (!searchResult) {
            return <EmptyTab />;
          }
          const children = searchResult
            .filter((item) => item.status === OrderStatus.SHIPPING)
            .sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt));
          if (children.length === 0) {
            return <EmptyTab />;
          }
          return children.map((item) => (
            <OrderItem key={item.id} data={item} />
          ));
        })(),
      },
      {
        key: OrderStatus.SUCCESS,
        label: "Thành công",
        children: (() => {
          if (!searchResult) {
            return <EmptyTab />;
          }
          const children = searchResult
            .filter((item) => item.status === OrderStatus.SUCCESS)
            .sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt));
          if (children.length === 0) {
            return <EmptyTab />;
          }
          return children.map((item) => (
            <OrderItem key={item.id} data={item} />
          ));
        })(),
      },
      {
        key: OrderStatus.CANCEL,
        label: "Đã hủy",
        children: (() => {
          if (!searchResult) {
            return <EmptyTab />;
          }
          const children = searchResult
            .filter((item) => item.status === OrderStatus.CANCEL)
            .sort((a, b) => Date.parse(b.createAt) - Date.parse(a.createAt));
          if (children.length === 0) {
            return <EmptyTab />;
          }
          return children.map((item) => (
            <OrderItem key={item.id} data={item} />
          ));
        })(),
      },
    ];
    setItems(items);
  }, [searchResult]);

  if (isLoading) {
    return (
      <PageWrapper
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Space direction="vertical" align="center" size={"large"}>
          <Spin />
          <Text>Đang tải dữ liệu</Text>
        </Space>
      </PageWrapper>
    );
  }

  if (isError) {
    return (
      <PageWrapper
        style={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Space direction="vertical" align="center" size={"large"}>
          <CloseCircleOutlined style={{ fontSize: "3rem", color: "red" }} />
          <Text>Có lỗi xảy ra trong quá trình tải dữ liệu</Text>
        </Space>
      </PageWrapper>
    );
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (data) {
      const searchValue = e.target.value;
      const searchResult = data.filter((item) =>
        item.id.toString().includes(searchValue)
      );
      setSearchResult(searchResult);
    }
  };

  if (data) {
    return (
      <PageWrapper>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm theo ID đơn hàng"
          onChange={(e) => handleSearch(e)}
        />
        <Tabs defaultActiveKey="1" items={items} />
      </PageWrapper>
    );
  }
};
export default PurchasePage;
