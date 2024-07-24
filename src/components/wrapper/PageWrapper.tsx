import React, { CSSProperties } from "react";

interface IPageWrapper {
  children: React.ReactNode;
  style?: CSSProperties;
}

const PageWrapper: React.FC<IPageWrapper> = ({ children, style }) => {
  return (
    <div
      style={{
        padding: "0 1rem",
        paddingTop: "2rem",
        width: "100%",
        height: "100%",
        backgroundColor: "var(--white)",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default PageWrapper;
