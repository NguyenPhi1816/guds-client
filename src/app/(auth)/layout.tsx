import { Metadata } from "next";
import SessionModal from "@/components/modal/sessionModal";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import Wrapper from "@/components/wrapper";
import AuthHeader from "@/components/authHeader";

export const metadata: Metadata = {
  title: "GUDS - Trang chủ",
  description: "GUDS - Website bán hàng công nghệ hàng đầu Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "var(--white)",
      }}
    >
      <AuthHeader />
      <Wrapper>
        <Layout>
          <Content>{children}</Content>
        </Layout>
      </Wrapper>
      <SessionModal />
    </Layout>
  );
}
