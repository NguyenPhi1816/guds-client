"use client";
import styles from "./Header.module.scss";
import classNames from "classnames/bind";

import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  Flex,
  Layout,
  MenuProps,
  Space,
} from "antd";
import Link from "next/link";
import AppSearchBar from "../searchbar/AppSearchBar";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getSession, signOut, useSession } from "next-auth/react";
import Wrapper from "../wrapper";
import { useEffect, useState } from "react";
import { Session } from "next-auth";

const { Header } = Layout;

const cx = classNames.bind(styles);

const items: MenuProps["items"] = [
  {
    key: "1",
    label: (
      <Button onClick={() => {}} type="link" className={cx("menu-item")}>
        Đơn hàng của tôi
      </Button>
    ),
  },
  {
    key: "2",
    label: (
      <Button onClick={() => signOut()} type="link" danger>
        Đăng xuất
      </Button>
    ),
  },
];

const AppHeader = () => {
  const fallbackUserAvatarUrl = "/images/no-user-image.webp";

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  return (
    <Header className={cx("header")}>
      <Wrapper>
        <Flex
          className={cx("header-wrapper")}
          justify="space-between"
          align="center"
        >
          <Link href="/">
            <Flex align="center">
              <img className={cx("logo")} src="/images/logo.png" />
            </Flex>
          </Link>
          <div className={cx("search")}>
            <AppSearchBar />
          </div>
          <Space size={"large"}>
            <Flex align="center">
              <Button shape="circle" type="text">
                <Badge count={5} size="small">
                  <ShoppingCartOutlined className={cx("icon")} />
                </Badge>
              </Button>
            </Flex>
            <Flex align="center">
              <Button shape="circle" type="text">
                <Badge count={5} size="small">
                  <HeartOutlined className={cx("icon")} />
                </Badge>
              </Button>
            </Flex>
            {session && session.user ? (
              <Dropdown menu={{ items }} placement="bottomRight">
                <Avatar
                  shape="circle"
                  src={
                    session.user.image
                      ? session.user.image
                      : fallbackUserAvatarUrl
                  }
                />
              </Dropdown>
            ) : (
              <Flex align="center">
                <Button href="/login" shape="circle" type="text">
                  <UserOutlined className={cx("icon")} />
                </Button>
              </Flex>
            )}
          </Space>
        </Flex>
      </Wrapper>
    </Header>
  );
};

export default AppHeader;
