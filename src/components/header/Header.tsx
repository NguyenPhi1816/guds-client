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
  Skeleton,
  Space,
} from "antd";
import Link from "next/link";
import AppSearchBar from "../searchbar/AppSearchBar";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getSession, signOut } from "next-auth/react";
import Wrapper from "../wrapper";
import { useQuery } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category";
import useMessage from "antd/es/message/useMessage";
import { getFavoriteProducts } from "@/services/cookie";
import {
  CART_QUERY_KEY,
  CATEGORIES_QUERY_KEY,
  FAVORITE_PRODUCT_QUERY_KEY,
  SESSION_QUERY_KEY,
} from "@/services/queryKeys";
import { getCart } from "@/services/cart";
import { useRouter } from "next/navigation";

const { Header } = Layout;

const cx = classNames.bind(styles);

const AppHeader = () => {
  const router = useRouter();
  const fallbackUserAvatarUrl = process.env.NEXT_PUBLIC_FALLBACK_USER_IMAGE;
  const [messageApi, contextHolder] = useMessage();

  const { data, isLoading, isError } = useQuery({
    queryFn: async () => await getAllCategories(),
    queryKey: [CATEGORIES_QUERY_KEY],
  });

  const {
    data: favoriteProducts,
    isLoading: favoriteProductsLoading,
    isError: favoriteProductsError,
  } = useQuery({
    queryFn: async () => await getFavoriteProducts(),
    queryKey: [FAVORITE_PRODUCT_QUERY_KEY],
  });

  const {
    data: cart,
    isLoading: cartLoading,
    isError: cartError,
  } = useQuery({
    queryFn: async () => await getCart(),
    queryKey: [CART_QUERY_KEY],
  });

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryFn: async () => await getSession(),
    queryKey: [SESSION_QUERY_KEY],
  });

  console.log(session);

  if (isError || favoriteProductsError || cartError || sessionError) {
    messageApi.error("Có lỗi xảy ra trong quá trình tải dữ liệu");
  }

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Button
          onClick={() => router.push("/user/profile")}
          type="link"
          className={cx("menu-item")}
        >
          Quản lý tài khoản
        </Button>
      ),
    },
    {
      key: "2",
      label: (
        <Button
          onClick={() => router.push("/user/purchases")}
          type="link"
          className={cx("menu-item")}
        >
          Đơn hàng của tôi
        </Button>
      ),
    },
    {
      key: "3",
      label: (
        <Button onClick={() => signOut()} type="link" danger>
          Đăng xuất
        </Button>
      ),
    },
  ];

  return (
    <Header className={cx("header")}>
      <Wrapper>
        <Flex
          className={cx("header-top")}
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
              <Button
                onClick={() => router.push("/cart")}
                shape="circle"
                type="text"
              >
                <Badge showZero count={cart ? cart.length : 0} size="small">
                  <ShoppingCartOutlined className={cx("icon")} />
                </Badge>
              </Button>
            </Flex>
            <Flex align="center">
              <Button
                onClick={() => router.push("/favorite")}
                shape="circle"
                type="text"
              >
                <Badge
                  showZero
                  count={
                    favoriteProducts && favoriteProducts.data
                      ? favoriteProducts.data.length
                      : "0"
                  }
                  size="small"
                >
                  <HeartOutlined className={cx("icon")} />
                </Badge>
              </Button>
            </Flex>
            {!session && sessionLoading ? (
              <Skeleton.Avatar active className={cx("skeleton-avatar")} />
            ) : !session ? (
              <Flex align="center">
                <Button href="/login" shape="circle" type="text">
                  <UserOutlined className={cx("icon")} />
                </Button>
              </Flex>
            ) : (
              session.user && (
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
              )
            )}
          </Space>
        </Flex>
        <Flex className={cx("header-bottom")}>
          {isLoading
            ? new Array(5)
                .fill(0)
                .map((item, index) => (
                  <Skeleton.Input
                    key={index}
                    active
                    size="small"
                    className={cx("skeleton-input")}
                  />
                ))
            : data?.slice(0, 5).map((category) => (
                <Link
                  className={cx("header-bottom-link")}
                  key={category.id}
                  href={`/category/${category.slug}`}
                >
                  {category.name}
                </Link>
              ))}
        </Flex>
      </Wrapper>
      {contextHolder}
    </Header>
  );
};

export default AppHeader;
