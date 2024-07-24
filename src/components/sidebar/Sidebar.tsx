"use client";

import styles from "./Sidebar.module.scss";
import classNames from "classnames/bind";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import { Menu, Typography, Avatar, Button, Skeleton, Space, Flex } from "antd";
import Sider from "antd/es/layout/Sider";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category";
import useMessage from "antd/es/message/useMessage";
import { UpOutlined } from "@ant-design/icons";
import { CATEGORIES_QUERY_KEY } from "@/services/queryKeys";

type MenuItem = Required<MenuProps>["items"][number];
const { Title } = Typography;

const cx = classNames.bind(styles);

const Sidebar = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [messageApi, contextHolder] = useMessage();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getAllCategories(),
    queryKey: [CATEGORIES_QUERY_KEY],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const newItems: MenuItem[] = data.map((category) => ({
        key: category.slug,
        label: category.name,
        icon: <Avatar shape="square" src={category.image} />,
        children: category.children.map((child) => ({
          key: child.slug,
          label: child.name,
          icon: <Avatar shape="square" src={child.image} />,
        })),
        onTitleClick: (e) => {
          e.domEvent.preventDefault();
          e.domEvent.stopPropagation();
          router.push(`/category/${e.key}`);
        },
        expandIcon: (
          <Button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleSubMenu(category.slug);
            }}
            shape="circle"
            type="text"
          >
            <UpOutlined style={{ fontSize: "10px" }} />
          </Button>
        ),
      }));
      setItems(newItems);
    }
  }, [data]);

  if (isError) {
    messageApi.error("Có lỗi xảy ra trong quá trình tải dữ liệu");
  }

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    e.domEvent.preventDefault();
    router.push(`/category/${e.key}`);
  };

  const toggleSubMenu = (key: string) => {
    setOpenKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  return (
    <Sider className={cx("sider")}>
      <Title level={5}>Danh mục sản phẩm</Title>

      {isLoading ? (
        <div className={cx("menu")}>
          {new Array(5).fill(0).map((item, index) => (
            <Flex
              key={index}
              align="center"
              justify="space-between"
              className={cx("menu-skeleton")}
            >
              <Skeleton.Avatar shape="square" active />
              <Skeleton.Button className={cx("menu-skeleton-input")} active />
              <Skeleton.Button className={cx("menu-skeleton-button")} active />
            </Flex>
          ))}
        </div>
      ) : (
        <Menu
          className={cx("menu")}
          mode="inline"
          items={items}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={handleMenuClick}
        />
      )}
      {contextHolder}
    </Sider>
  );
};

export default Sidebar;
