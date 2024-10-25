"use client";

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    paymentId: `bb-${Date.now().toString().slice(-4)}`,
    paymentCode: `PAY-${Date.now().toString().slice(-6)}`,
    amount: null,
    paymentMethod: 'cash',
    orderCode: ''
  });
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/payments/processPayment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Payment failed');
      // Handle success response (e.g., redirect or show a success message)
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/order/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Failed to fetch product data');

        setFormData((prevData) => ({
          ...prevData,
          amount: data.productPrice,
          paymentId: data._id,
          orderCode: data.orderCode
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
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form onSubmit={handlePayment} className="w-full max-w-md p-6 space-y-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Payment Form</h2>
        
        {/* Payment ID */}
        <div>
          <label htmlFor="paymentId" className="block text-sm font-medium text-gray-700">
            Payment ID
          </label>
          <input
            type="text"
            id="paymentId"
            defaultValue={formData.paymentId}
            required
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
          />
        </div>

        {/* Payment Code */}
        <div>
          <label htmlFor="paymentCode" className="block text-sm font-medium text-gray-700">
            Payment Code
          </label>
          <input
            type="text"
            id="paymentCode"
            defaultValue={formData.paymentCode}
            readOnly
            className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Order Code */}
        <div>
          <label htmlFor="orderCode" className="block text-sm font-medium text-gray-700">
            Order Code
          </label>
          <input
            type="text"
            id="orderCode"
            defaultValue={formData.orderCode}
            readOnly
            className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none"
          />
        </div>

        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={formData.amount || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
          />
        </div>

        {/* Payment Method */}
        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
            Payment Method
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
