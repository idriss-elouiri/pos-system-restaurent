"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormRegister from "../FormRegister";

const EditStaff = () => {
  const { id } = useParams();
  const [editStaff, setEditStaff] = useState(null);
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const getStaff = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/user/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch staff data'); // إذا كانت الاستجابة غير جيدة
        }

        setEditStaff(data); // تعيين البيانات
      } catch (err) {
        setError(err.message); // تعيين الخطأ
      } finally {
        setLoading(false); // تعيين حالة التحميل على false بعد الانتهاء
      }
    };
    getStaff();
  }, [id]);

  if (loading) return <p>Loading...</p>; // رسالة التحميل
  if (error) return <p>Error: {error}</p>; // رسالة الخطأ

  // تحقق من وجود بيانات editStaff قبل التمرير
  return editStaff ? <FormRegister {...editStaff} /> : <p>No staff data available</p>;
};

export default EditStaff;
