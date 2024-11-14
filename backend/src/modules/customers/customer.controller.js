import bcrypt from "bcryptjs"; // Changed import name for clarity
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken";
import Customer from "./customer.models.js";

// Helper function to omit sensitive fields
const omitPassword = (customer) => {
  const { passwordCustomer, ...rest } = customer._doc;
  return rest;
};

export const registerCustomerHandler = async (req, res, next) => {
  const {
    nameCustomer,
    emailCustomer,
    passwordCustomer,
    phoneNumberCustomer,
    isCustomer,
  } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(passwordCustomer, 10);

    const newCustomer = new Customer({
      nameCustomer,
      emailCustomer,
      passwordCustomer: hashedPassword,
      phoneNumberCustomer,
      isCustomer,
    });

    await newCustomer.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Error registering customer:", error); // Log error for debugging
    next(error);
  }
};

export const loginCustomerHandler = async (req, res, next) => {
  const { emailCustomer, passwordCustomer } = req.body;

  try {
    const validCustomer = await Customer.findOne({ emailCustomer });
    if (!validCustomer) {
      return next(errorHandler(404, "Customer not found"));
    }

    // Compare the provided password with the stored hashed password
    const validPassword = bcrypt.compareSync(
      passwordCustomer,
      validCustomer.passwordCustomer
    );
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }

    // Create JWT token
    const token = jwt.sign(
      { id: validCustomer._id, isCustomer: validCustomer.isCustomer },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Set token expiration
    );

    // Send the response without the password
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      })
      .json(omitPassword(validCustomer));
  } catch (error) {
    console.error("Error logging in customer:", error); // Log error for debugging
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  if (req.user.id !== req.params.CustomerId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  const updates = { ...req.body };

  // Check if the password is provided and hash it only if it is
  if (updates.passwordCustomer) {
    updates.passwordCustomer = bcrypt.hashSync(updates.passwordCustomer, 10);
  } else {
    // Remove passwordCustomer from updates if it's not provided
    delete updates.passwordCustomer;
  }

  try {
    const validCustomer = await Customer.findByIdAndUpdate(
      req.params.CustomerId,
      { $set: updates },
      { new: true, runValidators: true } // Ensure validation is applied
    );

    if (!validCustomer) {
      return next(errorHandler(404, "Customer not found"));
    }

    res.status(200).json(omitPassword(validCustomer));
  } catch (error) {
    console.error("Error updating customer:", error); // Log error for debugging
    next(error);
  }
};
export const deleteCustomer = async (req, res, next) => {
  if (req.user.id !== req.params.CustomerId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(
      req.params.CustomerId
    );
    if (!deletedCustomer) {
      return next(errorHandler(404, "Customer not found"));
    }
    res.status(200).json({ message: "Customer has been deleted" });
  } catch (error) {
    console.error("Error deleting customer:", error); // Log error for debugging
    next(error);
  }
};

export const signoutCustomer = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Customer has been signed out" });
  } catch (error) {
    console.error("Error signing out customer:", error); // Log error for debugging
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

    const CustomersWithoutPassword = customers.map(omitPassword);
    const totalCustomers = await Customer.countDocuments();

    // Count customers created in the last month
    const lastMonthCustomersCount = await Customer.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      customers: CustomersWithoutPassword,
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
    res.status(200).json(omitPassword(customer));
  } catch (error) {
    console.error("Error fetching customer:", error); // Log error for debugging
    next(error);
  }
};
