import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "@/context/UserContext";
import { message } from "antd";



const SessionCard = ({ session, setActiveSessions, activeSessions,current }: any) => {
  const [loading, setLoading] = useState(false);
  const { user } = useContext(UserContext);

  const createdAt = new Date(session.createdAt);
  //date   in june 18,2023 format
  const date = createdAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  //time in 12:00 AM format
  const time = createdAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const handleTerminate = async () => {
    try {
      setLoading(true);
      const terminateSession = await axios.delete(
        `sessions/terminate-session/${session._id}`
      );
      setActiveSessions(
        activeSessions.filter(
          (session: any) => session._id !== terminateSession.data.sessionDoc._id
        )
      );
      console.log(terminateSession.data);
      message.success("Session terminated successfully");
    } catch (error) {
      console.error("Error: ", error);
      message.error("Error in terminating session");
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div id="preloader" />;

  return (
    <div className="border p-5 items-center jsutify-center grid gap-1">
      <div className="flex justify-between gap-1">
        <h4 className="font-bold text-xl">{date}</h4>
        {current && <h4 className="text-red-600 font-bold"> (Current Session)</h4>}
      </div>
      <div className="flex gap-2">
        <h3 className="text-base">
          <span className="font-bold">{user.username}</span> was Logged in on{" "}
          {session.ua.os.name}.
        </h3>
        <h4 className="text-gray-400">{session.userId}</h4>
      </div>
      <div>
        <p>
          <span className="text-gray-500">IP Address-</span> {session.IP},
          <span className="text-gray-500"> Created At-</span> {date}, {time}
          <span className="text-gray-500"> Time stamp-</span>
          {session.createdAt}
        </p>
        <div>
          <span className="text-gray-500">Browser Details- </span>
          {session.ua.browser?.name} {session.ua.browser?.version}
          <span className="text-gray-500"> Engine Details- </span>
          {session.ua.engine?.name} {session.ua.engine?.version}
          <span className="text-gray-500"> OS Details- </span>
          {session.ua.os?.name} {session.ua.os?.version}
          <span className="text-gray-500"> CPU Details- </span>
          {session.ua.cpu?.architecture}
        </div>
      </div>
      <button className="text-blue-600 border-blue-600 italic hover:scale-105 transition duration-200 border w-fit bg-blue-100 px-1 rounded-lg " onClick={handleTerminate}>
        {" "}
        Terminate Session
      </button>
    </div>
  );
};

export default SessionCard;
