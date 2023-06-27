import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {message} from "antd";

interface propHistory {
  result: any;
  results: any;
  setResults: any;
}

const HistoryCard = ({ result, results, setResults }: propHistory) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      const response = await axios.delete("/scrapping/history/" + id);
      console.log("response: ", response.data);
      setResults(results.filter((result: any) => result._id !== id));
      message.success("Deleted Successfully!!");
    } catch (error) {
      console.error("Error: ", error);
      message.error("Error in deleting!!");
    } finally {
      setLoading(false);
    }
  };

  const date = new Date(result.searchedAt);
  const date1 = date.toLocaleDateString();
  const day = date.toLocaleString("default", { weekday: "short" });
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (loading) return <div id="preloader" />;

  return (
    <>
      <div className="border-2 sm:py-3 hover:scale-[1.01] ease-in-out transition duration-200 flex justify-between sm:gap-5 bg-gray-100 w-full lg:w-3/4  sm:px-2 p-1 rounded-xl ">
        <Link
          href={"/history/" + result._id}
          className="flex  px-2 items-center w-full overflow-hidden gap-4"
        >
          <div className="flex  items-center w-full overflow-hidden  gap-4">
            <div className=" items-center h-6 w-6 sm:h-8 sm:w-8 justify-center flex ">
              <img
                width={8}
                height={8}
                className="sm:w-8 sm:h-8 h-6"
                src={
                  result.searchedFrom === "Google"
                    ? "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png"
                    : "https://seeklogo.com/images/B/bing-logo-708D786F19-seeklogo.com.png"
                }
                alt={result.searchedFrom === "Google" ? "Google" : "Bing"}
              />
            </div>
            <div className="sm:text-base text-sm max-h-20 sm:w-5/6 w-2/3    ">
              <h2 className="sm:text-lg text-sm text-gray-400">Query</h2>
              <h1 className="font-bold [&::-webkit-scrollbar]:hidden overflow-x-scroll ">
                {result.query}
              </h1>
            </div>
          </div>
          <div className="sm:w-fit w-1/2  [&::-webkit-scrollbar]:hidden max-sm:overflow-x-scroll">
            <h2 className="sm:text-base text-[13px] text-gray-400">Date</h2>
            <div className="sm:flex grid sm:text-lg text-[13px] sm:gap-1 w-1/4">
              <p>{date1}</p>
              <h1 className="hidden sm:flex">{"(" + day + ")"}</h1>
            </div>
          </div>
        </Link>
        <div className="flex items-center gap-4">
          <div>
            <h2 className="sm:text-base text-[13px] text-gray-400">Time</h2>
            <h1 className="sm:text-base text-[13px]">{time}</h1>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="sm:w-6 sm:h-6 w-3 h-4  cursor-pointer hover:text-red-500 relative z-10 hover:scale-125 ease-in-out transition duration-200"
            onClick={() => handleDelete(result._id)}
          >
            <path
              fillRule="evenodd"
              d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </>
  );
};

export default HistoryCard;
