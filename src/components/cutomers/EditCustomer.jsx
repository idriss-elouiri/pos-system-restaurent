"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormRegisterCustomer from "./FormRegisterCustomer";

const EditCustomer = () => {
  const { id } = useParams();
  const [editCustomer, setEditCustomer] = useState(null);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getCustomer = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/user/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch customer data'); // إذا كانت الاستجابة غير جيدة
        }

        setEditCustomer(data); // تعيين البيانات
      } catch (err) {
        setError(err.message); // تعيين الخطأ
      } finally {
        setLoading(false); // تعيين حالة التحميل على false بعد الانتهاء
      }
    };
    getCustomer();
  }, [id]);

  if (loading) return <p>Loading...</p>; // رسالة التحميل
  if (error) return <p>Error: {error}</p>; // رسالة الخطأ

  // تحقق من وجود بيانات editcustomer قبل التمرير
  return editCustomer ? <FormRegisterCustomer {...editCustomer} /> : <p>No customer data available</p>;
};

export default EditCustomer;
