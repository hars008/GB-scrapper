const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const authRouter = require("./routes/auth");
const internalScrappingRouter = require("./scrappers/internalScrapper");
const scrappingRouter = require("./routes/scrapping");
const googleOAuthRouter = require("./routes/googleAuth");
const requestIp = require("request-ip");
const verifyToken = require("./middleware/jwtAuth");
const serviceRouter = require("./routes/services");
const sessionRouter = require("./routes/sessions");
const mySocket = require("./utils/sockets");
const bodyParser = require("body-parser");
const Tokens = require("csrf");

let globl_csrf_token;
var csrf_tokens = new Tokens();
var secret = csrf_tokens.secretSync();
const csrfProtection = (req, res, next) => {
  var token = req.body._csrf || req.query._csrf || req.headers["x-csrf-token"];
  console.log("token", token);
  if (
    !token ||
    !csrf_tokens.verify(secret, token) ||
    token != globl_csrf_token
  ) {
    return res.status(403).send("unauthorized");
  }
  next();
};

// app.use((req, res, next) => {
//   res.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Csrf-Token"
//   );
//   next();
// });

app.use(requestIp.mw());

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:8000",
      "http://localhost:3000",
      "https://6496fb42e163ac674de8f5a7--jazzy-tulumba-a1e579.netlify.app",
      "https://jazzy-tulumba-a1e579.netlify.app",
    ],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    credentials: true,
    SameSite: "none",
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/csrf-token", function (req, res) {
  var newToken = csrf_tokens.create(secret);
  console.log("new", newToken);
  globl_csrf_token = newToken;
  res.json({ csrfToken: newToken });
});

app.use("/authentication", csrfProtection, authRouter);

app.use("/internalScrapping", internalScrappingRouter);
app.use("/api/oauth", googleOAuthRouter);
app.use("/scrapping", (verifyToken, csrfProtection), scrappingRouter);
app.use("/services", (verifyToken, csrfProtection), serviceRouter);
app.use("/sessions", (verifyToken, csrfProtection), sessionRouter);

const server = app.listen(4000);
mySocket(server);
