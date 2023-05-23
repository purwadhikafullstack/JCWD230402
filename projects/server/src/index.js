const { join } = require("path");
require('dotenv').config({path:join(__dirname,'../.env')});
const express = require("express");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const app = express();
const bearerToken = require("express-bearer-token");
app.use(cors());
app.use(bearerToken());
app.use(express.json());
app.use(express.static("src/public"));

app.use("/", express.static(__dirname + "/public"));

//#region API ROUTES

// ===========================
// NOTE : Add your routes here
const authRouter = require("./Routers/authRouter");
const rajaongkirRouter = require("./Routers/rajaongkirRouter");
const warehouseRouter = require("./Routers/warehouseRouter");
const adminRouter = require("./Routers/adminRouter");
const categoryRouter = require("./Routers/categoryRouter");
const productRouter = require("./Routers/productRouter");
const profileRouter = require("./Routers/profileRouter");
const checkout = require("./Routers/checkoutRouter");
const stockMutation = require("./Routers/stockMutationRouter");
const order = require("./Routers/orderRouter");
const report = require("./Routers/reportRouter");

app.use("/api/auth", authRouter);
app.use("/api/rajaongkir", rajaongkirRouter);
app.use("/api/warehouse", warehouseRouter);
app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/profile", profileRouter);
app.use("/api/checkout", checkout);
app.use("/api/mutation", stockMutation);
app.use("/api/order", order);
app.use("/api/report", report);


const { statusUpdater } = require("./helpers/schedule");

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.get("/api/greetings", (req, res, next) => {
  res.status(200).json({
    message: "Hello, Student !",
  });
});

// ===========================

// not found
app.use((req, res, next) => {
  if (req.path.includes("/api/")) {
    res.status(404).send("Not found !");
  } else {
    next();
  }
});

statusUpdater();

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err);
    res.status(500).send("Error !");
  } else {
    next();
  }
});

//#endregion

//#region CLIENT
const clientPath = "../../client/build";
app.use(express.static(join(__dirname, clientPath)));

// Serve the HTML page
app.get("*", (req, res) => {
  res.sendFile(join(__dirname, clientPath, "index.html"));
});

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    console.log(`ERROR: ${err}`);
  } else {
    console.log(`APP RUNNING at ${PORT} ✅`);
  }
});
