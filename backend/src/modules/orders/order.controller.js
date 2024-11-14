import { errorHandler } from "../../utils/error.js";
import Order from "./order.models.js";

// Handler for creating a new order
export const create = async (req, res, next) => {
  const newOrder = new Order({
    ...req.body,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    next(error); // Pass error to error handler middleware
  }
};

// Handler for getting a list of orders with pagination
export const getOrders = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const orders = await Order.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalOrders = await Order.countDocuments();

    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const lastMonthOrders = await Order.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      orders,
      totalOrders,
      lastMonthOrders,
    });
  } catch (error) {
    next(error);
  }
};

// Handler for deleting an order
export const deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.orderId);
    if (!deletedOrder) {
      return next(errorHandler(404, 'Order not found')); // Error if the order doesn't exist
    }
    res.status(200).json({ message: 'The order has been deleted' });
  } catch (error) {
    next(error);
  }
};

// Handler for getting a specific order by ID
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId); // Ensure you are using the correct parameter key

    if (!order) {
      return next(errorHandler(404, 'Order not found')); // Call errorHandler if order is not found
    }

    res.status(200).json(order); // Return the found order
  } catch (error) {
    console.error("Error retrieving order:", error); // Log error for debugging
    next(error); // Pass any unexpected error to the next error handler
  }
};
export const getOrderCustomer = async (req, res, next) => {
  try {
    const orderCustomer = await Order.find({customerId: req.params.orderId}); // Ensure you are using the correct parameter key

    if (!orderCustomer) {
      return next(errorHandler(404, 'Order not found')); // Call errorHandler if order is not found
    }

    res.status(200).json(orderCustomer); // Return the found order
  } catch (error) {
    console.error("Error retrieving orderCustomer:", error); // Log error for debugging
    next(error); // Pass any unexpected error to the next error handler
  }
};
