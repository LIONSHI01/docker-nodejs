const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis")(session);
const cors = require("cors");

const {
  MONGO_USER,
  MONGO_IP,
  MONGO_PASSWORD,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

let redisClient = redis.createClient({
  host: REDIS_URL,
  port: REDIS_PORT,
});

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

// NOTE: Inifinite loop to Reconnect mongodb if has error or when db is ready
const connectWithRetry = () => {
  // the "@mongo:27017" below, replace ip address with mongo, as mongo is run within the same docker service
  mongoose
    .connect(mongoURL)
    .then(() => console.log("successfully connected to DB"))
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.enable("trust proxy");
// app.use(cors({}));

// NOTE: should state the session before first middleware(app.use(express,json()))
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      // saveUninitialized: false,
      // resave: false,
      maxAge: 30000,
      secure: false,
      httpOnly: true,
    },
  })
);

app.use(express.json());

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hi world!!</h2>");
  console.log("It is runing !!!!");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
