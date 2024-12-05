import styles from "./AppSearchBar.module.scss";
import classNames from "classnames/bind";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Form, Input, MenuProps, Space } from "antd";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useCallback, useEffect } from "react";
import debounce from "lodash/debounce";
import {
  getRelatedSearchKeyword,
  getUserSearchRecommend,
} from "@/services/user";
import { MenuDividerType } from "antd/es/menu/interface";

const cx = classNames.bind(styles);

const AppSearchBar = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [userSearchRecommend, setUserSearchRecommend] = useState<{
    history: string[];
    popularKeywords: string[];
  }>();

  useEffect(() => {
    const fetcher = async () => {
      const result = await getUserSearchRecommend();
      setUserSearchRecommend(result);
    };

    fetcher();
  }, []);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value === "") {
      return debouncedSearch("");
    }

    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      const result = await getRelatedSearchKeyword(value);
      setUserSearchRecommend(result);
    }, 1000),
    []
  );

  const handleSearch = (keyword?: string) => {
    if (!keyword) {
      return router.push(`/search?name=${encodeURIComponent(searchValue)}`);
    }
    return router.push(`/search?name=${encodeURIComponent(keyword)}`);
  };

  let items: MenuProps["items"] = [];

  if (userSearchRecommend) {
    const historyDivider = {
      key: "history-title",
      label: <strong style={{ color: "#666" }}>Lịch sử tìm kiếm</strong>,
      disabled: true,
    };

    const menuDivider: MenuDividerType = {
      type: "divider",
    };

    const popularKeywordsDivider = {
      key: "popular-title",
      label: <strong style={{ color: "#666" }}>Từ khóa phổ biến</strong>, // Tiêu đề từ khóa phổ biến
      disabled: true,
    };

    const history = userSearchRecommend.history.map((item) => ({
      key: item,
      label: (
        <Button
          onClick={() => handleSearch(item)}
          type="link"
          style={{ color: "#000" }}
        >
          {item}
        </Button>
      ),
    }));

    const popularKeywords = userSearchRecommend.popularKeywords.map((item) => ({
      key: item,
      label: (
        <Button
          onClick={() => handleSearch(item)}
          type="link"
          style={{ color: "#000" }}
        >
          {item}
        </Button>
      ),
    }));

    if (history.length > 0) {
      items.push(historyDivider);
      items = [...items, ...history];
    }

    if (history.length > 0 && popularKeywords.length > 0) {
      items.push(menuDivider);
      items.push(popularKeywordsDivider);
    }

    items = [...items, ...popularKeywords];
  }

  return (
    <Form className={cx("form")}>
      <Form.Item className={cx("form-item")}>
        <Dropdown menu={{ items }} placement="bottomLeft">
          <Space.Compact style={{ width: 500 }}>
            <Input
              placeholder="Tìm kiếm sản phẩm"
              size="large"
              className={cx("form-item-input")}
              value={searchValue}
              onChange={handleSearchChange}
            />
            <Button
              type="primary"
              onClick={() => handleSearch()}
              style={{ height: 38 }}
            >
              <SearchOutlined className={cx("icon")} />
              Tìm kiếm
            </Button>
          </Space.Compact>
        </Dropdown>
      </Form.Item>
    </Form>
  );
};

export default AppSearchBar;
