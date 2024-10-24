import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken";
import Staff from "./hrm.models.js";

export const registerStaffHandler = async (req, res, next) => {
  const { nameStaff, emailStaff, passwordStaff, numberStaff, isStaff} = req.body;
  const hashedPassword = bcryptjs.hashSync(passwordStaff, 10);

  try {
    const newStaff = new Staff({
      nameStaff,
      emailStaff,
      passwordStaff: hashedPassword,
      numberStaff,
      isStaff
    });
    await newStaff.save();
    res.status(201).json("Signup successful");
  } catch (error) {
    next(error);
  }
};

export const loginStaffHandler = async (req, res, next) => {
  const { emailStaff, passwordStaff } = req.body;

  try {
    const validStaff = await Staff.findOne({ emailStaff });
    if (!validStaff) {
      return next(errorHandler(404, "Staff not found"));
    }
    const validPassword = bcryptjs.compareSync(passwordStaff, validStaff.passwordStaff);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    const token = jwt.sign(
      { id: validStaff._id, isAdmin: validStaff.isAdmin },
      process.env.JWT_SECRET
    );

    const { passwordStaff: pass, ...rest } = validStaff._doc;

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


export const updateStaff = async (req, res, next) => {
  req.body.passwordStaff = bcryptjs.hashSync(req.body.passwordStaff, 10);

  try {
    const updatedstaff = await Staff.findByIdAndUpdate(
      req.params.staffId,
      {
        $set: {
          nameStaff: req.body.nameStaff,
          emailStaff: req.body.emailStaff,
          profilePictureStaff: req.body.profilePictureStaff,
          passwordStaff: req.body.passwordStaff,
          numberStaff: req.body.numberStaff,
          isStaff: req.body.isStaff,
        },
      },
      { new: true }
    );
    const { passwordStaff, ...rest } = updatedstaff._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteStaff = async (req, res, next) => {
  try {
    await Staff.findByIdAndDelete(req.params.staffId);
    res.status(200).json('Staff has been deleted');
  } catch (error) {
    next(error);
  }
};

export const signoutStaff = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('Staff has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getStaffs = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const Staffs = await Staff.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const StaffsWithoutPassword = Staffs.map((Staff) => {
      const { passwordStaff, ...rest } = Staff._doc;
      return rest;
    });

    const totalStaffs = await Staff.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthStaffs = await Staff.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      Staffs: StaffsWithoutPassword,
      totalStaffs,
      lastMonthStaffs,
    });
  } catch (error) {
    next(error);
  }
};

export const getStaff = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.params.staffId);
    if (!staff) {
      return next(errorHandler(404, 'Staff not found'));
    }
    const { passwordStaff, ...rest } = staff._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};