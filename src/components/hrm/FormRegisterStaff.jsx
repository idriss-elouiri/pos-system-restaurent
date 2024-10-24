"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const FormRegisterStaff = ({
  _id,
  nameStaff: existingName,
  emailStaff: existingEmail,
  numberStaff: existingNumber,
  passwordStaff: existingPassword,
  isStaff: existingIsStaff,
}) => {

  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  const generateStaffNumber = () => {
    const now = new Date();
    return `ST-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${now
      .getTime()
      .toString()
      .slice(-4)}`;
  };

  const staffNumber = generateStaffNumber();

  const [formData, setFormData] = useState({
    nameStaff: existingName || '',
    emailStaff: existingEmail || '',
    passwordStaff: existingPassword || '',
    numberStaff: existingNumber || staffNumber,
    isStaff: existingIsStaff || false, 
  });
  console.log(formData)
  const handleInputChange = (e) => {
    const { id, value, checked } = e.target; 

    setFormData((prev) => ({
      ...prev,
      [id]: id === "isStaff" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = _id 
      ? `${apiUrl}/api/hrm/updateStaff/${_id}` 
      : `${apiUrl}/api/hrm/registerStaff`;

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
    router.push("/hrm"); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
        <h2 className="text-2xl font-bold text-center">{_id ? "Edit Staff" : "Register Staff"}</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Number Field */}
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700"
            >
              Staff Number
            </label>
            <input
              type="text"
              id="numberStaff"
              value={formData.numberStaff}
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
              Staff Name
            </label>
            <input
              type="text"
              id="nameStaff"
              value={formData.nameStaff}
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
              Staff Email
            </label>
            <input
              type="email"
              id="emailStaff"
              value={formData.emailStaff}
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
              Staff Password
            </label>
            <input
              type="password"
              id="passwordStaff"
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Checkbox Field */}
          <div>
            <label>
              <input
                id="isStaff"
                type="checkbox"
                checked={formData.isStaff}
                onChange={handleInputChange}
              />
              Is Staff
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {_id ? "Edit Staff" : "Add Staff"}
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

export default FormRegisterStaff;
