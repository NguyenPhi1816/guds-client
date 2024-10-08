import { Inter } from "next/font/google";
import "./index.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Metadata } from "next";
import ReactQueryProvider from "@/utils/reactQueryProvider/ReactQueryProvider";
import NextAuthProvider from "@/utils/nextAuthProvider/NextAuthProvider";
import { Suspense } from "react";
import SessionModal from "@/components/modal/sessionModal";
import MessageProvider from "@/utils/messageProvider/MessageProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/images/basic-logo.png",
  },
  title: "GUDS - Website bán hàng công nghệ hàng đầu Việt Nam",
  description: "GUDS - Website bán hàng công nghệ hàng đầu Việt Nam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
          <NextAuthProvider>
            <ReactQueryProvider>
              <MessageProvider>
                <Suspense fallback={<div>Loading...</div>}>
                  <SessionModal />
                  {children}
                </Suspense>
              </MessageProvider>
            </ReactQueryProvider>
          </NextAuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
