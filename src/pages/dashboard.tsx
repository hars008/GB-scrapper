import React, { use, useEffect } from "react";
import { useState, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import generateBrowserFingerprint from "@/util/GenerateFingerprint";
import { getSocket, connectSocket } from "@/util/Socket";
import { message } from "antd";

const Dashboard = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([] as any);
  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const { user, ready, setUser, token, refreshToken } = useContext(UserContext);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!ready) return;
    if (ready && !user) {
      router.push("/login");
    }
  }, [user]);
  let userId: string;
  if (user) {
    userId = user.id;
  }

  let socket = getSocket();
  // if (!socket) {
  //   socket = connectSocket(token, refreshToken);
  // }

  console.log("user: ", user, ready, redirect);

  let fingerPrint = "";

  generateBrowserFingerprint()
    .then((result) => {
      fingerPrint = result;
    })
    .catch((error) => {
      console.error("Error:Genertating FingerPrint ", error);
    });

  const handleBSubmit = async (e: any) => {
    e.preventDefault();
    if (!query) {
      alert("Please enter a query");
      message.error("Please enter a query");
      return;
    }
    console.log("userId: ", userId);
    console.log("query: ", query);
    console.log("fingerPrint: ", fingerPrint);

    setLoading(true);
    try {
      if (!socket) {
        socket = connectSocket(token, refreshToken);
      }
      socket.emit("Bsearch", { userId, query, fingerPrint });
      socket.on("Bsearchres", (data: any) => {
        console.log("data: ", data);
        setResults(data);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error: ", error);
    }
  };
  const handleGSubmit = async (e: any) => {
    e.preventDefault();
    if (!query) {
      message.error("Please enter a query");
      return;
    }
    console.log("userId: ", userId);
    console.log("query: ", query);
    console.log("fingerPrint: ", fingerPrint);
    setLoading(true);
    try {
       if (!socket) {
         socket = connectSocket(token, refreshToken);
       }
      socket.emit("Gsearch", { userId, query, fingerPrint });
      socket.on("Gsearchres", (data: any) => {
        console.log("data: ", data);
        setResults(data);
        setLoading(false);
      });
    } catch (error) {
      console.error("Error: ", error);
      setLoading(false);
    }
  };
  if (!ready || loading) {
    return <div id="preloader" />;
  }
  // if(loading) return <div id="preloader" />;

  return (
    <>
      {contextHolder}
      <div className="flex flex-col items-center justify-center mt-10 ">
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-gray-500">Type your Query</p>
        <form className="flex flex-col mt-2 rounded-2xl w-fit mx-auto  border px-10 py-5 bg-gray-100 ">
          <div className="flex items-center bg-white px-2 rounded-2xl h-12 border shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>

            <input
              type="text"
              id="query"
              className="  w-full rounded-2xl px-4 py-2 focus:outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query"
              required
            />
          </div>
          <div className="justify-between border gap-2 rounded-full  w-full sm:flex">
            <button
              type="submit"
              className="primary mt-5 hover:shadow-2xl"
              onClick={handleBSubmit}
            >
              Bing Search
            </button>
            <button
              type="submit"
              className="primary mt-5 hover:shadow-2xl"
              onClick={handleGSubmit}
            >
              Google&nbsp;Search
            </button>
          </div>
        </form>
      </div>
      <div className="sm:p-10 mt-4 ">
        {loading && <p>Loading...</p>}
        {results.length > 0 && !loading ? (
          <div className="w-full flex flex-col">
            <h1 className="text-[30px] max-sm:text-center">Results</h1>
            <div className="gap-2 flex flex-col  w-full">
              {results.map((result: any, index: number) => (
                <div
                  key={index}
                  className="border-2 hover:scale-105 transition duration-200 rounded-xl p-2"
                >
                  <div className="flex item-center gap-4 pb-2 border-b  ">
                    <div className="sm:w-11 sm:h-11 w-8 h-8 rounded-lg item-center justify-between">
                      <img
                        src={result.img}
                        alt={result.title}
                        width={100}
                        height={100}
                        className="sm:w-11 sm:h-11 w-8 h-8"
                      />
                    </div>
                    <div className="flex flex-col w-full overflow-hidden">
                      <a
                        href={result.link}
                        className="sm:text-xl text-base text-blue-900 w-full font-bold "
                      >
                        {result.title}
                      </a>
                      <a
                        href={result.link}
                        className="text-blue-600 text-sm w-full"
                      >
                        {result.link}
                      </a>
                    </div>
                  </div>
                  <p className="text-gray-600 ">{result.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          ""
        )}
        {results.length === 0 && !loading && (
          <p className="text-gray-600">No results found</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
