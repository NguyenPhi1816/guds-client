import { Carousel } from "antd";
import styles from "./HomeCarousel.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const images = [
  "https://res.cloudinary.com/dgw0an06z/image/upload/v1721635430/d7mp4046rewhcn8avsrq.jpg",
  "https://res.cloudinary.com/dgw0an06z/image/upload/v1721635430/zzrm4rnvmnyg8wlkh8jx.jpg",
  "https://res.cloudinary.com/dgw0an06z/image/upload/v1721635429/y2zua5yefzaq9w1e8xl0.jpg",
  "https://res.cloudinary.com/dgw0an06z/image/upload/v1721635431/g3fmgzoyadzcb9dswzat.jpg",
  "https://res.cloudinary.com/dgw0an06z/image/upload/v1721635431/wwjbs4vfdijfglcfyo0a.png",
  "https://res.cloudinary.com/dgw0an06z/image/upload/v1721635430/me2b5kcr7xtmsvoqkxzh.jpg",
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
