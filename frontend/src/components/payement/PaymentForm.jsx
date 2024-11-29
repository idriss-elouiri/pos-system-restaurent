"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    paymentId: `bb-${Date.now().toString().slice(-4)}`,
    paymentCode: `PAY-${Date.now().toString().slice(-6)}`,
    amount: "",
    paymentMethod: "cash",
    orderCode: "",
  });

  const { id } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      setError("Amount must be a positive number.");
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/payments/processPayment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Payment failed");
      router.push("/receipts");
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const getProduct = async () => {
        try {
          const res = await fetch(`${apiUrl}/api/order/${id}`);
          const data = await res.json();
          if (!res.ok)
            throw new Error(data.message || "Failed to fetch product data");
          setFormData((prevData) => ({
            ...prevData,
            amount: (data.productQty * data.productPrice).toFixed(2),
            paymentId: currentUser._id,
            orderCode: data.orderCode,
          }));
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
  }, [id]);

  if (loading) return <div>تحميل...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handlePayment}
        className="w-full max-w-md p-6 space-y-4 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center text-gray-700">
          نموذج الدفع
        </h2>

        {/* Payment ID */}
        <div>
          <label
            htmlFor="paymentId"
            className="block text-sm font-medium text-gray-700"
          >
            معرف الدفع
          </label>
          <input
            type="text"
            id="paymentId"
            value={formData.paymentId}
            readOnly
            className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Payment Code */}
        <div>
          <label
            htmlFor="paymentCode"
            className="block text-sm font-medium text-gray-700"
          >
            كود الدفع
          </label>
          <input
            type="text"
            id="paymentCode"
            value={formData.paymentCode}
            readOnly
            className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Order Code */}
        <div>
          <label
            htmlFor="orderCode"
            className="block text-sm font-medium text-gray-700"
          >
            كود الطلب
          </label>
          <input
            type="text"
            id="orderCode"
            value={formData.orderCode}
            readOnly
            className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            سعر الطلب الاجمالي
          </label>
          <input
            type="number"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            required
          />
        </div>

        {/* Payment Method */}
        <div>
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700"
          >
            وسيلة الدفع
          </label>
          <select
            id="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
          >
            <option value="cash">Cash</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
