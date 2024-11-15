"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormRegisterStaff from "./FormRegisterStaff";

const EditStaff = () => {
  const { id } = useParams();
  const [editStaff, setEditStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getStaff = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/hrm/${id}`);
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch staff data");
          }

          setEditStaff(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      if (id) {
        getStaff();
      } else {
        setError("No staff ID provided.");
        setLoading(false);
      }
    }
  }, [id, apiUrl]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return editStaff ? (
    <FormRegisterStaff {...editStaff} />
  ) : (
    <p>No staff data available</p>
  );
};

export default EditStaff;
