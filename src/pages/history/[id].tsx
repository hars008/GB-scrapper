import React from 'react'
import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from 'next/router';
import ResultCard from "@/components/ResultCard";

const HistoryQuery = () => {
  const router = useRouter();
  const [results, setResults] = useState([]as any);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  let userId = user?._id || user?.id;

  const { id } = router.query;

  useEffect(() => {
    setLoading(true);
    const getHistory = async () => {
      try {
        const response = await axios.get(
          "/scrapping/history/" + userId + "/" + id
        );
        setResults(response.data[0]);
        console.log("response: ", response.data[0]);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    getHistory();
  }, [user, id, userId]);
  if (loading) return <div id="preloader" />;
  return (
    <div>
      <div className="border-2 border-black p-2 rounded-xl mx-1 shadow-md">
        <div className="grid sm:grid-cols-3 text-center gap-2">
          <div className="border  bg-gray-200 py-2 rounded-xl w-full">
            <h2>Searched For:</h2>
            <h1 className="sm:p-2 font-bold">{results?.query}</h1>
          </div>
          <div className="border bg-gray-200 py-2 rounded-xl w-full">
            <h2>Searched From:</h2>
            <h1 className="sm:p-2 font-bold">{results?.searchedFrom}</h1>
          </div>
          <div className="border bg-gray-200 py-2 rounded-xl w-full">
            <h2>Searched At:</h2>
            <h1 className="sm:p-2 font-bold">{results?.searchedAt}</h1>
          </div>
        </div>
      </div>
      <ResultCard results={results?.results} />
    </div>
  );
};


export default HistoryQuery
