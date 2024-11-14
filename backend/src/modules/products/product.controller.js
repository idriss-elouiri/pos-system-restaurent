import { errorHandler } from "../../utils/error.js";
import Product from "./product.models.js";

export const createProduct = async (req, res, next) => {
  const newProduct = new Product({
    ...req.body,
  });

  try {
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error); // Log error for debugging
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const products = await Product.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProducts = await Product.countDocuments();

    // Get the count of products created in the last month
    const lastMonthProductsCount = await Product.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });

    res.status(200).json({
      products,
      totalProducts,
      lastMonthProducts: lastMonthProductsCount,
    });
  } catch (error) {
    console.error("Error fetching products:", error); // Log error for debugging
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
    if (!deletedProduct) {
      return next(errorHandler(404, 'Product not found'));
    }
    res.status(200).json({ message: 'The product has been deleted' });
  } catch (error) {
    console.error("Error deleting product:", error); // Log error for debugging
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      { $set: { ...req.body } }, // Use spread operator for flexibility
      { new: true, runValidators: true } // Ensures validation on update
    );

    if (!updatedProduct) {
      return next(errorHandler(404, 'Product not found'));
    }
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error); // Log error for debugging
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return next(errorHandler(404, 'Product not found'));
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error); // Log error for debugging
    next(error);
  }
};
