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
  Modal,
  Skeleton,
  Space,
} from "antd";
import Link from "next/link";
import AppSearchBar from "../searchbar/AppSearchBar";
import {
  ExclamationCircleFilled,
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getSession, signOut } from "next-auth/react";
import Wrapper from "../wrapper";
import { useQueries } from "@tanstack/react-query";
import { getAllCategories } from "@/services/category";
import { getFavoriteProducts } from "@/services/cookie";
import {
  CART_QUERY_KEY,
  CATEGORIES_QUERY_KEY,
  FAVORITE_PRODUCT_QUERY_KEY,
  SESSION_QUERY_KEY,
} from "@/services/queryKeys";
import { getCart } from "@/services/cart";
import { useRouter } from "next/navigation";
import { useGlobalMessage } from "@/utils/messageProvider/MessageProvider";

const { Header } = Layout;
const { confirm } = Modal;

const cx = classNames.bind(styles);

const AppHeader = () => {
  const router = useRouter();
  const fallbackUserAvatarUrl = process.env.NEXT_PUBLIC_FALLBACK_USER_IMAGE;
  const message = useGlobalMessage();

  const queries = useQueries({
    queries: [
      {
        queryKey: [CATEGORIES_QUERY_KEY],
        queryFn: async () => await getAllCategories(),
      },
      // {
      //   queryKey: [FAVORITE_PRODUCT_QUERY_KEY],
      //   queryFn: async () => await getFavoriteProducts(),
      // },
      {
        queryKey: [CART_QUERY_KEY],
        queryFn: async () => await getCart(),
      },
      {
        queryKey: [SESSION_QUERY_KEY],
        queryFn: async () => await getSession(),
      },
    ],
  });

  const [
    categoriesQuery,
    // favoriteProductsQuery,
    cartQuery,
    sessionQuery,
  ] = queries;

  const isLoading =
    categoriesQuery.isLoading ||
    // favoriteProductsQuery.isLoading ||
    cartQuery.isLoading ||
    sessionQuery.isLoading;

  const isError =
    categoriesQuery.isError ||
    // favoriteProductsQuery.isError ||
    cartQuery.isError ||
    sessionQuery.isError;

  const handleSignOut = () => {
    confirm({
      title: "Đăng xuất",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có muốn đăng xuất không",
      okText: "Đăng xuất",
      okType: "danger",
      cancelText: "Không",
      onOk() {
        signOut();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

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
        <Button onClick={handleSignOut} type="link" danger>
          Đăng xuất
        </Button>
      ),
    },
  ];

  if (isError) {
    router.push("/error");
    return <div></div>;
  }

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
                <Badge
                  showZero
                  count={cartQuery.data ? cartQuery.data.length : 0}
                  size="small"
                >
                  <ShoppingCartOutlined className={cx("icon")} />
                </Badge>
              </Button>
            </Flex>
            {/* <Flex align="center">
              <Button
                onClick={() => router.push("/favorite")}
                shape="circle"
                type="text"
              >
                <Badge
                  showZero
                  count={
                    favoriteProductsQuery.data &&
                    favoriteProductsQuery.data.data
                      ? favoriteProductsQuery.data.data.length
                      : "0"
                  }
                  size="small"
                >
                  <HeartOutlined className={cx("icon")} />
                </Badge>
              </Button>
            </Flex> */}
            {!sessionQuery.data && sessionQuery.isLoading ? (
              <Skeleton.Avatar active className={cx("skeleton-avatar")} />
            ) : !sessionQuery.data ? (
              <Flex align="center">
                <Button href="/login" shape="circle" type="text">
                  <UserOutlined className={cx("icon")} />
                </Button>
              </Flex>
            ) : (
              sessionQuery.data.user && (
                <Dropdown menu={{ items }} placement="bottomRight">
                  <Avatar
                    shape="circle"
                    src={
                      sessionQuery.data.user.user.image
                        ? sessionQuery.data.user.user.image
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
            : categoriesQuery.data?.slice(0, 5).map((category) => (
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
    </Header>
  );
};

export default AppHeader;
