"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormProduct from "./FormProduct";

const EditProduct = () => {
  const { id } = useParams();
  const [editProduct, setEditProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getProduct = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/product/${id}`);
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch product data");
          }

          setEditProduct(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      if (id) {
        getProduct();
      }
    }
  }, [id, apiUrl]);

  if (loading) return <p className="text-center">Loading...</p>; // Consider adding a spinner here
  if (error)
    return (
      <div className="text-red-500 text-center">
        <p>Error: {error}</p>
        <button
          onClick={() => setError(null)}
          className="bg-indigo-600 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );

  return editProduct ? (
    <FormProduct {...editProduct} />
  ) : (
    <p className="text-center">No product data available</p>
  );
};

export default EditProduct;
