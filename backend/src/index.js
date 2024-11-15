import express from "express";
import cors from "cors";
import { connectDb } from "./config/db.js";
import authRouter from "./modules/auth/auth.route.js";
import customerRouter from "./modules/customers/customer.route.js";
import hrmRouter from "./modules/hrm/hrm.route.js";
import userRouter from "./modules/user/user.route.js";
import productRouter from "./modules/products/product.route.js";
import orderRouter from "./modules/orders/order.route.js";
import paymentRouter from "./modules/payement/payment.routes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
dotenv.config();

connectDb();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/hrm", hrmRouter);
app.use("/api/customer", customerRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/payments", paymentRouter);

app.get("/*", (req, res) => {
  res.json("hello world");
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
