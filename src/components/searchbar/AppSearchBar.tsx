import styles from "./AppSearchBar.module.scss";
import classNames from "classnames/bind";

import { SearchOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState, useCallback } from "react";
import debounce from "lodash/debounce";

const cx = classNames.bind(styles);

const AppSearchBar = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value === "") {
      return debouncedSearch("_");
    }

    debouncedSearch(value);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      router.push(`/search?name=${encodeURIComponent(value)}`);
    }, 1000),
    []
  );

  return (
    <Form className={cx("form")}>
      <Form.Item className={cx("form-item")}>
        <Input
          prefix={<SearchOutlined className={cx("icon")} />}
          placeholder="Tìm kiếm sản phẩm"
          size="large"
          className={cx("form-item-input")}
          value={searchValue}
          onChange={handleSearchChange}
        />
      </Form.Item>
    </Form>
  );
};

export default AppSearchBar;
