import React from "react";

interface IWrapper {
  children: React.ReactNode;
}

const Wrapper: React.FC<IWrapper> = ({ children }) => {
  return (
    <div
      style={{
        margin: "0 auto",
        padding: "0 2rem",
        maxWidth: "1440px",
        height: "100%",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};

export default Wrapper;
