"use client";

import styles from "./UserSidebar.module.scss";
import classNames from "classnames/bind";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { MenuProps } from "antd";
import {
  Menu,
  Typography,
  Avatar,
  Button,
  Skeleton,
  Space,
  Flex,
  Divider,
} from "antd";
import Sider from "antd/es/layout/Sider";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category";
import useMessage from "antd/es/message/useMessage";
import {
  EditOutlined,
  LockOutlined,
  UnorderedListOutlined,
  UpOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { CATEGORIES_QUERY_KEY, SESSION_QUERY_KEY } from "@/services/queryKeys";
import { getSession } from "next-auth/react";

type MenuItem = Required<MenuProps>["items"][number];
const { Title, Text } = Typography;

const cx = classNames.bind(styles);

const UserSidebar = () => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [messageApi, contextHolder] = useMessage();
  const router = useRouter();

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryFn: async () => await getSession(),
    queryKey: [SESSION_QUERY_KEY],
  });

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    e.domEvent.preventDefault();
    router.push(`/user/${e.key}`);
  };

  const toggleSubMenu = (key: string) => {
    setOpenKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  const items: MenuItem[] = [
    {
      key: "profile",
      label: "Thông tin cá nhân",
      icon: <UserOutlined />,
      children: [
        {
          key: "profile",
          label: "Hồ sơ",
          icon: <UserOutlined />,
        },
        {
          key: "password",
          label: "Thay đổi mật khẩu",
          icon: <LockOutlined />,
        },
      ],
      onTitleClick: (e) => {
        e.domEvent.preventDefault();
        e.domEvent.stopPropagation();
        router.push(`/user/${e.key}`);
      },
      expandIcon: (
        <Button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSubMenu("profile");
          }}
          shape="circle"
          type="text"
        >
          <UpOutlined style={{ fontSize: "10px" }} />
        </Button>
      ),
    },
    {
      key: "purchases",
      label: "Đơn mua",
      icon: <UnorderedListOutlined />,
      children: [],
      expandIcon: <div></div>,
      onTitleClick: (e) => {
        e.domEvent.preventDefault();
        e.domEvent.stopPropagation();
        router.push(`/user/${e.key}`);
      },
    },
  ];

  return (
    session &&
    session.user && (
      <Sider className={cx("sider")}>
        <Space align="center" style={{ padding: "0.5rem 0.75rem" }}>
          <Avatar src={session.user.image} alt={session.user.name} />
          <Text ellipsis strong>
            {session.user.name}
          </Text>
          <Button shape="circle" type="text">
            <EditOutlined />
          </Button>
        </Space>
        <Divider />
        <Menu
          className={cx("menu")}
          mode="inline"
          items={items}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          onClick={handleMenuClick}
        />
        {contextHolder}
      </Sider>
    )
  );
};

export default UserSidebar;
