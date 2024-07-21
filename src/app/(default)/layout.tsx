import { Metadata } from "next";
import AppHeader from "@/components/header/Header";
import { Content } from "antd/es/layout/layout";
import SessionModal from "@/components/modal/sessionModal";
import { Layout } from "antd";

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
    <Layout hasSider={true} style={{ height: "100vh" }}>
      {/* <Sidebar /> */}
      <Layout>
        <AppHeader />
        <Content>{children}</Content>
        <SessionModal />
      </Layout>
    </Layout>
  );
}
