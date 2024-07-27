"use client";
import { Layout } from "antd";
import Wrapper from "../wrapper";
import Link from "next/link";

const { Header } = Layout;

const AuthHeader = () => {
  return (
    <Header style={{ backgroundColor: "var(--white)" }}>
      <Wrapper>
        <Link href="/">
          <img
            src="/images/logo.png"
            style={{ width: "72px", height: "100%", objectFit: "contain" }}
          />
        </Link>
      </Wrapper>
    </Header>
  );
};

export default AuthHeader;
