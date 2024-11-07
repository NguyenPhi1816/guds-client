import { Carousel } from "antd";
import styles from "./HomeCarousel.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const images = [
  "https://mir-s3-cdn-cf.behance.net/project_modules/max_3840_webp/34b5bf180145769.6505ae7623131.jpg",
  "https://www.timesbull.com/wp-content/uploads/2024/09/Samsung-Galaxy-S24-Ultra-1024x576.webp",
];

const HomeCarousel = () => {
  return (
    <Carousel autoplay dots={false} className={cx("carousel")}>
      {images.map((image, index) => {
        if (index % 2 === 0) {
          return (
            <div key={index} className={cx("carousel-item")}>
              <img src={image} className={cx("carousel-image")} />
              {images[index + 1] && (
                <img src={images[index + 1]} className={cx("carousel-image")} />
              )}
            </div>
          );
        }
        return null;
      })}
    </Carousel>
  );
};

export default HomeCarousel;
