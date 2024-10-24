"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormRegisterCustomer from "./FormRegisterCustomer";

const EditStaff = () => {
  const { id } = useParams();
  const [editCustomer, setEditCustomer] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
console.log(id)
  useEffect(() => {
    const getCustomer = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/customer/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch Customer data'); 
        }

        setEditCustomer(data); 
      } catch (err) {
        setError(err.message); 
      } finally {
        setLoading(false);
      }
    };
    if(id){

        getCustomer();
    }
  }, [id]);
  console.log(editCustomer)

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>; 
  return editCustomer ? <FormRegisterCustomer {...editCustomer} /> : <p>No Customer data available</p>;
};

export default EditStaff;
