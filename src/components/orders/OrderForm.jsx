"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const OrderForm = () => {
  const [customers, setCustomers] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = useParams();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    orderCode: `STF-${Date.now().toString().slice(-6)}`,
    productName: '',
    productPrice: null,
    productQty: '',
  });

  // Fetch customer data from API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/customer/getCustomers`);
        const data = await res.json();
        setCustomers(data.customers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };
    fetchCustomers();
  }, [id]);

  // Fetch product data
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/product/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch product data');
        }

        setFormData((prevData) => ({
          ...prevData,
          productPrice: data.productPrice,
          productName: data.productName,
        }));
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      getProduct();
    }
  }, [id]);

  // Update customer ID based on selected customer name
  const handleCustomerChange = (e) => {
    const selectedCustomerName = e.target.value;
    const selectedCustomer = customers.find(
      (customer) => customer.nameCustomer === selectedCustomerName
    );

    setFormData((prevData) => ({
      ...prevData,
      customerName: selectedCustomerName,
      customerId: selectedCustomer ? selectedCustomer._id : '',
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`${apiUrl}/api/order/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrorMessage(data.message || "An error occurred");
      setLoading(false);
      return;
    }
    router.push("/orders");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-6 space-y-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Order Form</h2>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label htmlFor="customerName" className="block text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <select
              id="customerName"
              value={formData.customerName}
              onChange={handleCustomerChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer._id} value={customer.nameCustomer}>
                  {customer.nameCustomer}
                </option>
              ))}
            </select>
          </div>

          {/* Customer ID */}
          <div>
            <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
              Customer ID
            </label>
            <input
              type="text"
              id="customerId"
              value={formData.customerId}
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
              value={formData.orderCode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              readOnly
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="productPrice" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              id="productPrice"
              value={formData.productPrice || ''}
              readOnly
              className="w-full px-3 py-2 mt-1 border rounded-md bg-gray-100 focus:outline-none"
            />
          </div>

          {/* Quantity */}
          <div>
            <label htmlFor="productQty" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="productQty"
              value={formData.productQty}
              onChange={(e) => setFormData({ ...formData, productQty: e.target.value })}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {loading ? 'Submitting...' : 'Submit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
