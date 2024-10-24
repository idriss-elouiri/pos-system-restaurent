"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FormRegisterCustomer = ({
  _id,
  name: existingName,
  email: existingEmail,
  number: existingNumber,
  password: existingPassword,
  isCustomer: existingIsCustomer,
}) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Corrected to router (instead of navigate)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Initialize formData with default values
  
  const generateCustomerNumber = () => {
    const now = new Date();
    return `ST-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now
      .getTime()
      .toString()
      .slice(-4)}`; // Output format: 'ST-20241022-1234'
  };

  const customerNumber = generateCustomerNumber();
  const [formData, setFormData] = useState({
    number: existingNumber || customerNumber,
    name: existingName || '',
    email: existingEmail || '',
    password: existingPassword || '',
    isCustomer: existingIsCustomer || false, // Changed to false as default for checkbox
  });
  console.log(formData)
  const handleInputChange = (e) => {
    const { id, value, checked } = e.target; // Destructure the event target properties

    setFormData((prev) => ({
      ...prev,
      [id]: id === "isCustomer" ? checked : value, // Set value based on field type
    }));
  };
 // Generate new staff number

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when starting the request

    const url = _id 
      ? `${apiUrl}/api/user/update/${_id}` 
      : `${apiUrl}/api/auth/register`;

    const res = await fetch(url, {
      method: _id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    
    if (!res.ok) {
      setErrorMessage(data.message || 'An error occurred'); // Set error message if any error occurs
      setLoading(false); // Set loading to false on error
      return;
    }

    // Successful response
    router.push("/customers"); // Use router.push instead of navigate.push
    setLoading(false); // Reset loading after submission
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center">{_id ? "Edit Customer" : "Register Customer"}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Number Field */}
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700"
            >
              Customer Number
            </label>
            <input
              type="text"
              id="number"
              value={formData.number}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              readOnly // Optionally make it read-only or manage it via state
            />
          </div>
          {/* Name Field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Customer Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Customer Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Customer Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Checkbox Field */}
          <div>
            <label>
              <input
                id="isCustomer"
                type="checkbox"
                checked={formData.isCustomer}
                onChange={handleInputChange}
              />
              Is Customer
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {_id ? "Edit Customer" : "Add Customer"}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="mt-2 text-sm text-red-600" id="username-error">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormRegisterCustomer;
