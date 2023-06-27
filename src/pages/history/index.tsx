import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import HistoryCard from "@/components/HistoryCard";
import { FcSearch } from "react-icons/fc";

const isSubsequence = (str: string, sub: string) => {
  let i = 0;
  let j = 0;
  while (i < str.length && j < sub.length) {
    if (str[i] === sub[j]) j++;
    i++;
  }
  return j === sub.length;
};

const HistoryPage = () => {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchedFrom, setSearchedFrom] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { user, ready } = useContext(UserContext);

  useEffect(() => {
    
    if(!ready) return;
    if (ready && !user) {
      router.push("/login");
    }
    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(
          `/scrapping/history/${user?.id || user?._id}`
        );
        setResults(data);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

      fetchHistory();
  }, [user]);

  if (!ready || loading) return <div id="preloader" />;
  
  const filteredResults = results.filter((result: any) => {
    const searchRegex = new RegExp(
      search.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"),
      "i"
    );
    const queryMatch =
      searchRegex.test(result.query) || isSubsequence(result.query, search);
    const searchedFromMatch = searchedFrom
      ? result.searchedFrom.toLowerCase() === searchedFrom.toLowerCase()
      : true;
    const dateRangeMatch =
      fromDate && toDate
        ? new Date(result.searchedAt) >= new Date(fromDate) &&
          new Date(result.searchedAt) <= new Date(toDate + "T23:59:59Z")
        : true;

    return queryMatch && searchedFromMatch && dateRangeMatch;
  });



  return (
    <>
      <div className="flex flex-col text-center border-y shadow-lg py-8  items-center justify-center mb-6 ">
        <div className="flex justify-between w-3/4 px-10 py-4 gap-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded-xl "
            onClick={() => {
              setSearchedFrom("");
              setFromDate("");
              setToDate("");
              setSearch("");
            }}
          >
            Clear Filters
          </button>
        </div>
        <div className="border-2 border-gray-300 p-2 lg:p-4 lg:w-3/4  rounded-xl mx-1 shadow-md">
          <div className="grid md:flex content-center content-between md:justify-between text-center gap-2">
            <div className="md:w-1/3 w-full max-w-64">
              <p className="text-gray-500">Query</p>
              <div className="border border-gray-400 flex gap-1 py-1 px-2 rounded-xl">
                <FcSearch className="text-2xl" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="focus:outline-none w-1/3"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="align-middle flex flex-col">
              <p className="text-gray-500">Searched From</p>
              <select
                name="searchedFrom"
                id="searchedFrom"
                placeholder="Searched"
                className="border text-gray-700 border-gray-400 bg-gray-100 rounded-xl p-2 focus:outline-none"
                value={searchedFrom}
                onChange={(e) => {
                  setSearchedFrom(e.target.value);
                }}
              >
                <option value="">Select Search Engine...</option>
                <option value="google">Google</option>
                <option value="bing">Bing</option>
              </select>
            </div>
            <div className="flex gap-2">
              <div>
                <p className="text-gray-500">From</p>
                <input
                  type="date"
                  className="border border-gray-400 rounded-xl p-1 focus:outline-none"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                  }}
                />
              </div>
              <div>
                <p className="text-gray-500">To</p>
                <input
                  type="date"
                  className="border border-gray-400 rounded-xl p-1 focus:outline-none"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:p-4 gap-4 m-auto items-center text-xl justify-center">
        {filteredResults.length > 0 ? (
          filteredResults.map((result, index) => (
            <HistoryCard
              result={result}
              results={results}
              setResults={setResults}
              key={index}
            />
          ))
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </>
  );
};

export default HistoryPage;
