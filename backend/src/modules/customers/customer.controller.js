import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken";
import Customer from "./customer.models.js"

export const registerCustomerHandler = async (req, res, next) => {
  const { nameCustomer, emailCustomer, passwordCustomer, phoneNumberCustomer, isCustomer} = req.body;
  const hashedPassword = bcryptjs.hashSync(passwordCustomer, 10);

  try {
    const newcustomer = new Customer({
      nameCustomer,
      emailCustomer,
      passwordCustomer: hashedPassword,
      phoneNumberCustomer,
      isCustomer
    });
    await newcustomer.save();
    res.status(201).json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export const loginCustomerHandler = async (req, res, next) => {
  const { emailCustomer, passwordCustomer } = req.body;

  try {
    const validcustomer = await Customer.findOne({ emailCustomer });
    if (!validcustomer) {
      return next(errorHandler(404, "Customer not found"));
    }
    const validPassword = bcryptjs.compareSync(passwordCustomer, validcustomer.passwordCustomer);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      { id: validcustomer._id, isAdmin: validcustomer.isAdmin },
      process.env.JWT_SECRET
    );

    const { passwordCustomer: pass, ...rest } = validcustomer._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: false, 
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const updateCustomer = async (req, res, next) => {
  req.body.passwordCustomer = bcryptjs.hashSync(req.body.passwordCustomer, 10);

  try {
    const validcustomer = await Customer.findByIdAndUpdate(
      req.params.CustomerId,
      {
        $set: {
          nameCustomer: req.body.nameCustomer,
          emailCustomer: req.body.emailCustomer,
          profilePictureCustomer: req.body.profilePictureCustomer,
          passwordCustomer: req.body.passwordCustomer,
          phoneNumberCustomer: req.body.phoneNumberCustomer,
          isCustomer: req.body.isCustomer,
        },
      },
      { new: true }
    );
    const { passwordCustomer, ...rest } = validcustomer._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteCustomer = async (req, res, next) => {
  try {
    await Customer.findByIdAndDelete(req.params.CustomerId);
    res.status(200).json('Customer has been deleted');
  } catch (error) {
    next(error);
  }
};

export const signoutCustomer = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('Customer has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getCustomers = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const customers = await Customer.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const CustomersWithoutPassword = customers.map((Customer) => {
      const { passwordCustomer, ...rest } = Customer._doc;
      return rest;
    });

    const totalCustomers = await Customer.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthCustomers = await Customer.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      customers: CustomersWithoutPassword,
      totalCustomers,
      lastMonthCustomers,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.CustomerId);
    if (!customer) {
      return next(errorHandler(404, 'Customer not found'));
    }
    const { passwordCustomer, ...rest } = customer._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};