import React, { CSSProperties } from "react";

interface IPageWrapper {
  children: React.ReactNode;
  style?: CSSProperties;
}

const PageWrapper: React.FC<IPageWrapper> = ({ children, style }) => {
  return (
    <div
      style={{
        padding: "2rem 1rem",
        width: "100%",
        height: "100%",
        overflow: "scroll",
        backgroundColor: "var(--white)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
