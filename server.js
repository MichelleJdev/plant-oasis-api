const express = require("express");
const app = express();
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: require("path").join(__dirname, "/config/.env"),
  });
  app.use(require("morgan")("dev"));
}

const connectDb = require("./config/db");
connectDb();

const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");

//Error handlers
const {
  logErrors,
  handleAppErrors,
  handleErrors,
} = require("./middleware/errorHandlers.middleware");

const CLIENT_URL = process.env.CLIENT_URL;

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use("/webhooks", express.raw({ type: "*/*" }));
app.use(express.json({ limit: "50mb" }));

app.use(cookieParser());
app.use(express.urlencoded());

app.use("/", routes);
app.use(logErrors);
app.use(handleAppErrors);
app.use(handleErrors);

const PORT = process.env.PORT;
mongoose.connection.once("open", () => {
  console.log("DB connection open");
  app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
});
