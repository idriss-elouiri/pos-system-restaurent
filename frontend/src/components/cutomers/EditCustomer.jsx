"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormRegisterCustomer from "./FormRegisterCustomer";

const EditCustomer = () => {
  const { id } = useParams();
  const [editCustomer, setEditCustomer] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getCustomer = async () => {
      if (!id || !apiUrl) return;

      try {
        const res = await fetch(`${apiUrl}/api/customer/${id}`);
        const data = await res.json();

        if (!res.ok) {
          // Provide more specific error messages based on the status code
          const errorMessage = res.status === 404
            ? 'Customer not found.'
            : data.message || 'Failed to fetch customer data';
          throw new Error(errorMessage); 
        }

        setEditCustomer(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };

    getCustomer();
  }, [id, apiUrl]); // Added apiUrl to dependency array

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-600 text-center">Error: {error}</p>; 
  
  return editCustomer ? (
    <FormRegisterCustomer {...editCustomer} />
  ) : (
    <p className="text-center">No customer data available</p>
  );
};

export default EditCustomer;
