import { Html, Head, Main, NextScript } from "next/document";
import React from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import Script from "next/script";
import Sidebar from "@/components/Sidebar";

const { Header, Content, Footer, Sider } = Layout;

export default function Document(): JSX.Element {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Html lang="en">
      <Head>
        {" "}
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
          async
          defer
        />{" "}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
