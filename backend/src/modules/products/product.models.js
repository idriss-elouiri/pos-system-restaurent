import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {

    productName: {
      type: String,
      required: true,
    },
    productDescription: {
      type: String,
      required: true,
    },
    productCode: {
      type: String,
      required: true,
      unique: true,
    },
    productImage: {
      type: String,
      required: true,
    },
    productPrice: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;