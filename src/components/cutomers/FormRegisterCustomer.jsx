"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FormRegisterCustomer = ({
  _id,
  nameCustomer: existingName,
  emailCustomer: existingEmail,
  phoneNumberCustomer: existingphoneNumberCustomer,
  passwordCustomer: existingPassword,
  isCustomer: existingIsCustomer,
}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    nameCustomer: existingName || '',
    emailCustomer: existingEmail || '',
    passwordCustomer: existingPassword || '',
    phoneNumberCustomer: existingphoneNumberCustomer || "",
    isCustomer: existingIsCustomer || false, 
  });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleInputChange = (e) => {
    const { id, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: id === "isCustomer" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = _id 
      ? `${apiUrl}/api/customer/updateCustomer/${_id}` 
      : `${apiUrl}/api/customer/registerCustomer`;

    try {
      const res = await fetch(url, {
        method: _id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'An error occurred');
      router.push("/customers");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          {_id ? "Edit Customer" : "Register Customer"}
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Phone Number Field */}
          <div className="flex flex-col">
            <label htmlFor="phoneNumberCustomer" className="text-sm font-medium text-gray-700">
              Customer Phone Number
            </label>
            <input
              type="text"
              id="phoneNumberCustomer"
              value={formData.phoneNumberCustomer}
              onChange={handleInputChange}
              className="p-3 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., 123-456-7890"
            />
          </div>

          {/* Name Field */}
          <div className="flex flex-col">
            <label htmlFor="nameCustomer" className="text-sm font-medium text-gray-700">
              Customer Name
            </label>
            <input
              type="text"
              id="nameCustomer"
              value={formData.nameCustomer}
              onChange={handleInputChange}
              className="p-3 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., John Doe"
            />
          </div>

          {/* Email Field */}
          <div className="flex flex-col">
            <label htmlFor="emailCustomer" className="text-sm font-medium text-gray-700">
              Customer Email
            </label>
            <input
              type="email"
              id="emailCustomer"
              value={formData.emailCustomer}
              onChange={handleInputChange}
              className="p-3 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., johndoe@example.com"
            />
          </div>

          {/* Password Field */}
          <div className="flex flex-col">
            <label htmlFor="passwordCustomer" className="text-sm font-medium text-gray-700">
              Customer Password
            </label>
            <input
              type="password"
              id="passwordCustomer"
              value={formData.passwordCustomer}
              onChange={handleInputChange}
              className="p-3 mt-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter a secure password"
            />
          </div>

          {/* Checkbox Field */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isCustomer"
              checked={formData.isCustomer}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isCustomer" className="text-sm text-gray-700">
              Is Customer
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 mt-6 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Processing..." : _id ? "Edit Customer" : "Add Customer"}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <p className="mt-2 text-sm text-center text-red-600">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormRegisterCustomer;