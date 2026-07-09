import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { adminMiddleware } from "../../middlewares/admin.middleware.js";

import {
    getOrders,
    getOrderById,
    placeOrder,
    getAllOrderForAdmin,
    updateOrderByAdmin,
} from "./order.contoller.js";

const orderRoute = express.Router();

// User
orderRoute.get("/", authMiddleware, getOrders);
orderRoute.get("/:orderId", authMiddleware, getOrderById);
orderRoute.post("/", authMiddleware, placeOrder);

// Admin
orderRoute.get("/admin/all", authMiddleware, adminMiddleware, getAllOrderForAdmin);
orderRoute.patch("/admin/:orderId", authMiddleware, adminMiddleware, updateOrderByAdmin);

export default orderRoute;