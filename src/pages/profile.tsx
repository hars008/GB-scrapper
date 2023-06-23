import SessionCard from "@/components/SessionCard";
import { UserContext } from "@/context/UserContext";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";

const Profile = () => {
  const router = useRouter();
  const { user, ready, token, refreshToken } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [activeSessions, setActiveSessions] = useState([]);

  let userId = user?.id;
  useEffect(() => {
    if (!ready) return;
    if (ready && !user) {
      router.push("/login");
    }
    const fetchSessions = async () => {
      setLoading(true);
      try {
        const userSessions = await axios.get(
          `sessions/all-sessions/${user?.id || user?._id}`
        );
        console.log(userSessions.data);
        setActiveSessions(userSessions.data.sessionsDoc);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  if (loading || !ready) return <div id="preloader" />;

  const checkCurrent = (sessionToken: any) => {
    console.log("sessionToken: ", sessionToken, " ", token);
    if (sessionToken === refreshToken) {
      return true;
    }

    return false;
  };
  return (
    <div>
      <h1>Profile</h1>
      <div>
        <h2 className="font-bold text-xl">Active Sessions</h2>
        <div className="gap-3 flex flex-col">
          {activeSessions.map((session: any) => (
            <div key={session._id} className="rounded-xl bg-gray-100 shadow-lg">
              <SessionCard
                session={session}
                setActiveSessions={setActiveSessions}
                activeSessions={activeSessions}
                current={checkCurrent(session.token)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
