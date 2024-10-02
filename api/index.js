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
const CsrfToken = require("./models/CsrfToken");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

app.use(requestIp.mw());

let globl_csrf_token;
var csrf_tokens = new Tokens();
var secret = csrf_tokens.secretSync();

const csrfProtection = async (req, res, next) => {
  try {
    const token =
      req.body._csrf || req.query._csrf || req.headers["x-csrf-token"];
    console.log("token", token);
    const IP = req.clientIp;

    if (!token) {
      return res.status(403).send("unauthorized");
    }

    const doc = await CsrfToken.findOne({ IP });
    if (!doc) {
      return res.status(403).send("unauthorized");
    }

    if (!csrf_tokens.verify(secret, token) || token != doc.csrfToken) {
      return res.status(403).send("unauthorized");
    }

    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// app.use((req, res, next) => {
//   res.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization, X-Csrf-Token"
//   );
//   next();
// });

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
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-csrf-token",
      "x-fingerprint",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/csrf-token", function (req, res) {
  var newToken = csrf_tokens.create(secret);
  const IP = req.clientIp;
  CsrfToken.findOne({ IP: IP })
    .then((token) => {
      if (token) {
        token.csrfToken = newToken;
        return token.save();
      } else {
        return CsrfToken.create({
          IP: IP,
          csrfToken: newToken,
        });
      }
    })
    .then(() => {
      res.json({ csrfToken: newToken });
    })
    .catch((error) => {
      if (error.code === 11000) {
        // Duplicate key error
        // Handle the error gracefully (e.g., log the error or send an appropriate response)
        console.log("Duplicate key error:", error);
        res.status(500).json({ error: "Duplicate key error" });
      } else {
        // Other errors
        console.log("Error:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });
});

app.use("/authentication", csrfProtection, authRouter);

app.use("/internalScrapping", internalScrappingRouter);
app.use("/api/oauth", googleOAuthRouter);
app.use("/scrapping", (verifyToken, csrfProtection), scrappingRouter);
app.use("/services", serviceRouter);
app.use("/sessions", (verifyToken, csrfProtection), sessionRouter);

const server = app.listen(4000);
mySocket(server);
