import Payment from "./payment.model.js";
import Order from "../orders/order.models.js";
import { errorHandler } from "../../utils/error.js";

// Function to process payments
export const processPayment = async (req, res) => {
  const { paymentId, paymentCode, orderCode, amount, paymentMethod, id } = req.body;

  try {
    // Validate input
    if (!paymentId || !paymentCode || !orderCode || !amount || !paymentMethod || !id) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Find the order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Create a new payment entry
    const payment = new Payment({
      paymentId,
      paymentCode,
      orderCode,
      amount,
      paymentMethod,
      orderId: id,
    });

    // Save payment details
    await payment.save();

    // Update order status
    order.isPaid = true;
    order.paymentDetails = { paymentId, paymentCode, amount, paymentMethod };
    await order.save();

    // Respond with success message
    res.status(200).json({
      message: "Payment processed successfully.",
      payment,
      order,
    });
  } catch (error) {
    console.error("Payment processing error:", error); // Log error for debugging
    res.status(500).json({
      message: "Payment processing failed.",
      error: error.message,
    });
  }
};

// Function to retrieve payments
export const getPayments = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    // Fetch payments from the database
    const payments = await Payment.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    // Get total count of payments
    const totalPayments = await Payment.countDocuments();

    res.status(200).json({
      payments,
      totalPayments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error); // Log error for debugging
    next(error);
  }
};

export const getPaymentCustomer = async (req, res, next) => {
  try {
    const { customerId } = req.params;

    // Fetch payment by customer ID, assuming it maps to `paymentId` in your Payment schema
    const paymentCts = await Payment.find({ paymentId: customerId });

    if (!paymentCts || paymentCts.length === 0) {
      return next(errorHandler(404, 'Payment information not found for this customer.'));
    }

    res.status(200).json(paymentCts);
  } catch (error) {
    console.error("Error retrieving payment data:", error); 
    next(errorHandler(500, 'Server error while retrieving payment data.'));
  }
};


