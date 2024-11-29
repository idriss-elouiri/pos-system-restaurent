import { errorHandler } from "../../utils/error.js";
import Customer from "./customer.models.js";

export const registerCustomerHandler = async (req, res, next) => {
  const { profilePictureCustomer, nameCustomer, address, contact } = req.body;

  try {
    const newCustomer = new Customer({
      profilePictureCustomer,
      nameCustomer,
      address,
      contact,
    });

    await newCustomer.save();
    res.status(201).json({ message: "لقد تم انشاء العميل بنجاح" });
  } catch (error) {
    console.error("خطا في اضافة العميل:", error); // Log error for debugging
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  if (!req.user.isAdmin && !req.user.isStaff) {
    return next(errorHandler(403, "You are not allowed to see all users"));
  }
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const customers = await Customer.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalCustomers = await Customer.countDocuments();

    // Count customers created in the last month
    const lastMonthCustomersCount = await Customer.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      customers,
      totalCustomers,
      lastMonthCustomers: lastMonthCustomersCount,
    });
  } catch (error) {
    console.error("Error fetching customers:", error); // Log error for debugging
    next(error);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.CustomerId);
    if (!customer) {
      return next(errorHandler(404, "Customer not found"));
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error); // Log error for debugging
    next(error);
  }
};
