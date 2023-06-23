import React, { useState, useEffect, useContext } from "react";
import { Menu, message } from "antd";
import {
  HomeFilled,
  UserOutlined,
  DashboardFilled,
  HistoryOutlined,
  PoweroffOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { Layout } from "antd";
import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import Image from "next/image";

const { Sider } = Layout;

const Sidebar = () => {
  const { user, setUser, ready } = useContext(UserContext);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasReadFromLocalStorage, setHasReadFromLocalStorage] = useState(false);
  const path = useRouter().pathname;
  const router = useRouter();

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      const storedCollapsed = localStorage.getItem("sidebarCollapsed");
      setCollapsed(storedCollapsed !== null && JSON.parse(storedCollapsed));
      setHasReadFromLocalStorage(true);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [collapsed]);

  const handleMenuClick = ({ key }: any) => {
    if (key === "logout") logout();
    else router.push(key);
  };

  const logout = async () => {
    setLoading(true);
    await axios.post("/authentication/logout");
    setUser(null);
    setLoading(false);
    message.success("Logged out successfully");
    router.push("/");
  };

  if (!hasReadFromLocalStorage || loading || !ready)
    return <div id="preloader" />;

  const items = [
    { key: "/", icon: <HomeFilled />, label: "Home" },
    user
      ? { key: "/dashboard", icon: <DashboardFilled />, label: "Dashboard" }
      : null,
    user
      ? { key: "/history", icon: <HistoryOutlined />, label: "History" }
      : null,
    user ? { key: "/profile", icon: <UserOutlined />, label: "Profile" } : null,
    {
      key: user ? "logout" : "/login",
      icon: user ? <PoweroffOutlined /> : <LoginOutlined />,
      label: user ? "Logout" : "Login",
      danger: Boolean(user),
    },
  ];

  return (
    <Sider
      className="max-md:hidden min-h-screen"
      
      collapsedWidth={50}
      collapsible
      trigger={null}
      collapsed={collapsed}
      onCollapse={setCollapsed}
    >
      <div className="relative sticky top-0">
        <div
          className="p-3 z-10 mb-3 grid justify-end bg-[#042140] cursor-pointer"
          onClick={() => setCollapsed(!collapsed)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white transform transition duration-200 ease-in-out"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{
              transform: collapsed ? "rotate(270deg)" : "rotate(90deg)",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <div className="demo-logo-vertical mb-5">
          <div className="p-1">
            <Image
              src="https://avatars.githubusercontent.com/u/28140896?s=280&v=4"
              alt="logo"
              width={0}
              height={0}
              layout="responsive"
            />
          </div>
          {!collapsed && (
            <h1 className="text-white text-xl font-bold text-center lg:grid">
              Scrapper
            </h1>
          )}
        </div>
        <Menu
          className=""
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          items={items}
          onClick={handleMenuClick}
        />
      </div>
    </Sider>
  );
};

export default Sidebar;
