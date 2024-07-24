import styles from "./ProductDescription.module.scss";
import classNames from "classnames/bind";

import { Button, Flex, Typography } from "antd";
import React, { useEffect, useState } from "react";

const { Title } = Typography;

interface IProductDescription {
  desc: string;
}

const cx = classNames.bind(styles);

const ProductDescription: React.FC<IProductDescription> = ({ desc }) => {
  const DESKTOP_HEIGHT = 500;
  const HIDDEN_HEIGHT = "auto";

  const [show, setShow] = useState<boolean>(false);
  const [height, setHeight] = useState<number | string>(DESKTOP_HEIGHT);

  useEffect(() => {
    if (show) {
      setHeight(HIDDEN_HEIGHT);
    } else {
      setHeight(DESKTOP_HEIGHT);
    }
  }, [show]);

  return (
    <div>
      <Title level={4} className={cx("title")}>
        Mô tả sản phẩm
      </Title>
      <div
        dangerouslySetInnerHTML={{ __html: desc }}
        className={cx("content")}
        style={{ height: height }}
      />
      <Flex justify="center">
        <Button className={cx("btn")} onClick={() => setShow((prev) => !prev)}>
          {show ? "Ẩn bớt" : "Xem Thêm"}
        </Button>
      </Flex>
    </div>
  );
};
export default ProductDescription;
