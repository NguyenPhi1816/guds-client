import { Inter } from "next/font/google";
import "./index.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Metadata } from "next";
import Provider from "@/components/provider";

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
        <Provider>
          <AntdRegistry>{children}</AntdRegistry>
        </Provider>
      </body>
    </html>
  );
}
