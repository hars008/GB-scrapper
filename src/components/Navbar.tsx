import React, { useState, useContext } from "react";
import { Button, Drawer, message } from "antd";
import { MenuOutlined, CloseCircleTwoTone } from "@ant-design/icons";
import { useRouter } from "next/router";
import { UserContext } from "@/context/UserContext";
import {
  HomeFilled,
  UserOutlined,
  DashboardFilled,
  HistoryOutlined,
  PoweroffOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const router = useRouter();
  const { user, setUser, ready } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

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

  const logout = async () => {
    setLoading(true);
    await axios.post("/authentication/logout");
    setUser(null);
    setLoading(false);
    message.success("Logged out successfully");
    setVisible(false);
    router.push("/");
  };

if (loading) return <div className="preloader"/>;
  return (
    <div className="md:hidden  w-fit">
      <div
        onClick={showDrawer}
        className="bg-[#031529] p-2 rounded-lg hover:scale-110 transition duration-300 ease-in-out text-white"
      >
        <MenuOutlined className="text-lg flex" />
      </div>
      <Drawer
        title="Menu"
        placement="left"
        closable
        onClose={onClose}
        closeIcon={
          <CloseCircleTwoTone
            style={{ fontSize: "26px", color: "#08c" }}
            className="hover:scale-[1.3] transition duration-200"
          />
        }
        open={visible}
        className="text-center  text-white opacity-90 !bg-gradient-to-r !to-black !from-zinc-900 "
        headerStyle={{
          color: "white",
          fontWeight: "bold",
        }}
      >
        <div className="demo-logo-vertical justify-center flex mb-4">
          <Image
            src="https://avatars.githubusercontent.com/u/28140896?s=280&v=4"
            alt="logo"
            height={160}
            width={160}
            className="w-40 h-40"
          />
        </div>
        <div className=" flex flex-col sm:gap-4 gap-2 text-[16px] leading-[45.24px] text-white ">
          {items.map((item) =>
            item ? (
              item.key !== "logout" ? (
                <Link href={item.key} key={item.key} legacyBehavior>
                  <a
                    className='flex items-center justify-center gap-2  "hover:text-blue-500"
                    hover:scale-110 transition duration-300 ease-in-out'
                    onClick={onClose}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </a>
                </Link>
              ) : (
                <Button
                  key={item.key}
                  type="link"
                  danger={item.danger}
                  onClick={logout}
                  loading={loading}
                  className="flex items-center text-lg justify-center gap-2 hover:text-red-500 hover:scale-110 transition duration-300 ease-in-out"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Button>
              )
            ) : null
          )}
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
