require("dotenv").config();
const cookieParser = require("cookie-parser");

const express = require("express");
const app = express();

// ConnectDB
const connectDB = require("./db/connect");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routes
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port...${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
