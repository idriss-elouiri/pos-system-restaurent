import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    nameCustomer: {
      type: String,
      required: true,
    },
    emailCustomer: {
      type: String,
      required: true,
      unique: true,
    },
    passwordCustomer: { 
      type: String,
      required: true,
    },
    profilePictureCustomer: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    phoneNumberCustomer:{
      type: String,
      required: true,
    },
    isCustomer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
