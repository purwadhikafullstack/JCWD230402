require("dotenv/config");
const express = require("express");
const cors = require("cors");
const { join } = require("path");
const PORT = process.env.PORT || 8000;
const app = express();
const bearerToken = require("express-bearer-token");
app.use(cors({}));
app.use(bearerToken());

app.use(express.json());
app.use("/", express.static(__dirname + "/public"));
//#region API ROUTES

// ===========================
// NOTE : Add your routes here
const authRouter = require("./Routers/authRouter");
app.use("/auth", authRouter);

const rajaongkirRouter = require("./Routers/rajaongkirRouter");
app.use("/rajaongkir", rajaongkirRouter);

const warehouseRouter = require("./Routers/warehouseRouter");
app.use("/warehouse", warehouseRouter);

const adminRouter = require("./Routers/adminRouter");
app.use("/admin", adminRouter);

const categoryRouter = require("./Routers/categoryRouter");
app.use("/category", categoryRouter);

const productRouter = require("./Routers/productRouter");
app.use("/product", productRouter);

const detailRouter = require("./Routers/detailRouter");
app.use("/detail", detailRouter);

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

// error
app.use((err, req, res, next) => {
  if (req.path.includes("/api/")) {
    console.error("Error : ", err.stack);
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
