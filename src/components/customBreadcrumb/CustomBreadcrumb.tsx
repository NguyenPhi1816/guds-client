"use client";

import styles from "./CustomBreadcrumb.module.scss";
import classNames from "classnames/bind";

import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Space, Typography } from "antd";
import Link from "next/link";
import React, { ReactNode } from "react";

const { Text } = Typography;

type ParentPage = {
  name: string;
  href: string;
};

interface ICustomBreadcrumb {
  currentPageName: ReactNode;
  parentPages?: ParentPage[];
}

const cx = classNames.bind(styles);

const CustomBreadcrumb: React.FC<ICustomBreadcrumb> = ({
  currentPageName,
  parentPages = [],
}) => {
  return (
    <Breadcrumb
      className={cx("breadcrumb")}
      separator=">"
      items={[
        {
          title: (
            <Link href="/">
              <Space>
                <HomeOutlined className={cx("breadcrumb-title")} />
                <Text className={cx("breadcrumb-title")}>Trang chủ</Text>
              </Space>
            </Link>
          ),
        },
        ...parentPages.map((item) => ({
          title: (
            <Link href={item.href}>
              <Space>
                <HomeOutlined className={cx("breadcrumb-title")} />
                <Text className={cx("breadcrumb-title")}>{item.name}</Text>
              </Space>
            </Link>
          ),
        })),
        {
          title: currentPageName,
        },
      ]}
    />
  );
};

export default CustomBreadcrumb;
