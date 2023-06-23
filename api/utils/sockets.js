const socketIo = require("socket.io"),
  jwt = require("jsonwebtoken");
const { processBSearch, processGSearch } = require("../routes/socketScrapping");

const mySocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:8000",
        "http://localhost:3000",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(err);
          return next(new Error("Authentication error"));
        }
        socket.decoded = decoded;
        next();
      });
    } else {
      next(new Error("Authentication error"));
    }
  });

  return io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on("token", ({ token }) => {
      console.log(token);
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log(err);
          return socket.emit("tokenres", { error: "Authentication error" });
        }
        socket.decoded = decoded;
        socket.emit("tokenres", { message: "Authentication success" });
      });
    });

    socket.on("Bsearch", ({ query, fingerPrint, userId }) => {
      console.log(query, fingerPrint, userId);
      const results = processBSearch({
        body: { query, fingerPrint, userId },
      });

      results.then((data) => {
        socket.emit("Bsearchres", data);
      });
    });
    socket.on("Gsearch", ({ query, fingerPrint, userId }) => {
      console.log(query, fingerPrint, userId);
      const results = processGSearch({
        body: { query, fingerPrint, userId },
      });

      results.then((data) => {
        socket.emit("Gsearchres", data);
      });
    });
  });
};

module.exports = mySocket;
