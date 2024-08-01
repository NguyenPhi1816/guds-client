import React, { CSSProperties } from "react";

interface IWrapper {
  children: React.ReactNode;
  style?: CSSProperties;
}

const Wrapper: React.FC<IWrapper> = ({ children, style = {} }) => {
  return (
    <div
      style={{
        margin: "0 auto",
        padding: "0 2rem",
        maxWidth: "1440px",
        height: "100%",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Wrapper;
