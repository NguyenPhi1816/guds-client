"use client";
import PageWrapper from "@/components/wrapper/PageWrapper";
import { OrderStatus } from "@/constant/enum/orderStatus";
import { getAllOrders } from "@/services/order";
import { ORDERS_QUERY_KEY } from "@/services/queryKeys";
import { SearchOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Empty, Input, Tabs, TabsProps } from "antd";
import OrderItem from "./components/orderItem/OrderItem";
import { ChangeEvent, useEffect, useState } from "react";
import { OrderFull } from "@/types/order";
import LoadingPage from "../loadingPage";
import ErrorPage from "../errorPage";

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

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (data) {
      const searchValue = e.target.value;
      const searchResult = data.filter((item) =>
        item.id.toString().includes(searchValue)
      );
      setSearchResult(searchResult);
    }
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  if (isError) {
    return <ErrorPage />;
  }

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
