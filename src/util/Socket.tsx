import io from "socket.io-client";


let socket: any = null;




export const connectSocket :typeof socket = (token: string) => {
  socket = io("http://localhost:4000", {
    withCredentials: true,
    auth: {
      token: token,
    },
  }); 
  return socket;
};

export const getSocket = () => {
  return socket;
};
