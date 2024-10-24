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
  console.log(formData)

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

    const res = await fetch(url, {
      method: _id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    
    if (!res.ok) {
      setErrorMessage(data.message || 'An error occurred');
      setLoading(false);
      return;
    }
    router.push("/customers"); 
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
              Customer Number Phone
            </label>
            <input
              type="text"
              id="phoneNumberCustomer"
              value={formData.phoneNumberCustomer}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
              id="nameCustomer"
              value={formData.nameCustomer}
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
              id="emailCustomer"
              value={formData.emailCustomer}
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
              id="passwordCustomer"
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
