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
    const getProduct = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/product/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch Product data'); 
        }

        setEditProduct(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };
    if(id){
        getProduct();
    }
  }, [id]);
  console.log(editProduct)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>; 
  return editProduct ? <FormProduct {...editProduct} /> : <p>No Product data available</p>;
};

export default EditProduct;
