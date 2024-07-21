import styles from "./AppSearchBar.module.scss";
import classNames from "classnames/bind";

import { SearchOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";

const cx = classNames.bind(styles);

const AppSearchBar = () => {
  return (
    <Form className={cx("form")}>
      <Form.Item className={cx("form-item")}>
        <Input
          prefix={<SearchOutlined className={cx("icon")} />}
          placeholder="Tìm kiếm sản phẩm"
          size="large"
          className={cx("form-item-input")}
        />
      </Form.Item>
    </Form>
  );
};
export default AppSearchBar;
