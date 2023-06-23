import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  DashboardFilled,
  HistoryOutlined,
  HomeFilled,
  UserOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { UserContext } from "@/context/UserContext";
import { useContext } from "react";
import { Space, Dropdown, message } from "antd";
import Link from "next/link";
import axios from "axios";
import Navbar from "./Navbar";


const PageHeader = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const path = useRouter().pathname;

  async function logout() {
    setLoading(true);
    await axios.post("/authentication/logout");
    setUser(null);
    setLoading(false);
    message.success("Logged out successfully");
    router.push("/");
  }

  let title = "";
  let icon = null;
  switch (path) {
    case "/":
      title = "Home";
      icon = <HomeFilled />;
      break;
    case "/dashboard":
      title = "Dashboard";
      icon = <DashboardFilled />;
      break;
    case "/history":
      title = "History";
      icon = <HistoryOutlined />;
      break;
    case "/history/[id]":
      title = "History";
      icon = <HistoryOutlined />;
      break;
    case "/profile":
      title = "Profile";
      icon = <UserOutlined />;
      break;
    case "/login":
      title = "";
      icon = (
      <Link href={"/"}>
      <HomeFilled />
      </Link>);
      break;
    case "/register":
      title = "Register";
      icon = <UserOutlined />;
      break;
    default:
      break;
  }

  if(loading) return <div id="preloader" />;

  const items = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: (
        <Link className="" href={"/profile"}>
          My Profile
        </Link>
      ),
    },
    {
      key: "2",
      icon: <HistoryOutlined />,
      label: (
        <Link className="" href={"/history"}>
          Search History
        </Link>
      ),
    },
    {
      key: "3",
      icon: <SettingOutlined />,
      label: (
        <Link className="" href={"/settings"}>
          Settings
        </Link>
      ),
    },
    {
      key: "4",
      danger: true,
      icon: <LogoutOutlined />,
      label: (
        <button onClick={logout} className="">
          Logout
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="flex px-2 mt-4 justify-between items-center ">
        <div className="flex items-center justify-center sm:text-xl text-base font-bold gap-2 ">
          <Navbar />
          <h2 className="w-fit  ">Scrapper</h2>
        </div>
        <div className="flex items-center justify-center sm:text-xl text-base font-bold gap-2 ">
          {icon}
          <h1>{title}</h1>
        </div>
        <div className="flex gap-2 items-center px-4 hover:scale-110 transition duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
          <Dropdown
            disabled={!user}
            overlayClassName="dropdown"
            menu={{
              items,
            }}
          >
            {/* <a onClick={(e) => e.preventDefault()}> */}
            <Space>
              {!!user ? (
                <a onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {user.username}
                    <DownOutlined />
                  </div>
                </a>
              ) : (
                <Link href="/login" className="text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-semibold">Login</div>
                  </div>
                </Link>
              )}
            </Space>
            {/* </a> */}
          </Dropdown>
        </div>
      </div>
    </>
  );
};

export default PageHeader;
