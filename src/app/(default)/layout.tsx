import { Metadata } from "next";
import SessionModal from "@/components/modal/sessionModal";
import { Layout } from "antd";
import AppHeader from "@/components/header";
import Sidebar from "@/components/sidebar";
import { Content } from "antd/es/layout/layout";
import Wrapper from "@/components/wrapper";

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
        overflowY: "hidden",
        backgroundColor: "var(--white)",
      }}
    >
      <AppHeader />
      <Wrapper>
        <Layout style={{ height: "calc(100vh - 96px)" }}>
          <Sidebar />
          <Content
            style={{
              height: "100%",
              overflowY: "hidden",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Wrapper>
      <SessionModal />
    </Layout>
  );
}
