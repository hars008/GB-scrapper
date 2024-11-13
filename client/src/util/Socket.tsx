import io from "socket.io-client";
import generateBrowserFingerprint from "./GenerateFingerprint";
let socket: any = null;



export const connectSocket: typeof socket = (token: string, refreshToken:string) => {
  const fingerPrint= generateBrowserFingerprint();
  // console.log("socket refresh ", refreshToken);
  socket = io("http://localhost:4000", {
    withCredentials: true,
    auth: {
      token: token,
      refreshToken: refreshToken,
      fingerPrint: fingerPrint,
    },
  });
  return socket;
};

export const getSocket = () => {
  return socket;
};
