import axios from "axios";
import { createContext, useEffect, useState } from "react";
import generateBrowserFingerprint from "../util/GenerateFingerprint";
import { getSocket, connectSocket } from "@/util/Socket";

export const UserContext = createContext<{
  user: any | null;
  setUser: any;
  ready: boolean;
  setReady: any;
  token: string | null;
  setToken: any;
  csrfToken: string | null;
  setCsrfToken: any;
  refreshToken: string | null;
}>({
  user: null,
  setUser: () => {},
  ready: false,
  setReady: () => {},
  token: null,
  setToken: () => {},
  csrfToken: null,
  setCsrfToken: () => {},
  refreshToken: null,

});

interface UserContextProviderProps {
  children: JSX.Element | JSX.Element[];
}

export function UserContextProvider({
  children,
}: UserContextProviderProps): JSX.Element {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fingerPrint = await generateBrowserFingerprint();
        console.log("fingerPrint: ", fingerPrint);
        axios.defaults.headers["X-Fingerprint"] = fingerPrint;
        const csrfToken = await axios.post('/csrf-token');
        console.log("csrfToken: ", csrfToken);
        axios.defaults.headers["X-CSRF-Token"] = csrfToken.data.csrfToken;
        setCsrfToken(csrfToken.data.csrfToken);
        const response = await axios.get(
          `/authentication/profile/${fingerPrint}`
        );
        console.log("response: ", response);
        setUser(response.data.decoded);
        setToken(response.data.token);
        setRefreshToken(response.data.refreshToken);
        const socket = getSocket();
        if (!socket) {
          connectSocket(response.data.token, response.data.refreshToken);
        }
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setReady(true);
      }
    };

    fetchUserData();
  }, []);

  const value = {
    user,
    setUser,
    ready,
    setReady,
    token,
    setToken,
    csrfToken,
    setCsrfToken,
    refreshToken,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
