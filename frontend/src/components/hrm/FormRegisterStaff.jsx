"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineUserAdd } from "react-icons/hi";

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
  const [formData, setFormData] = useState({
    nameStaff: existingName || "",
    emailStaff: existingEmail || "",
    passwordStaff: existingPassword || "",
    numberStaff: existingNumber || `STF-${Date.now().toString().slice(-6)}`,
    isStaff: existingIsStaff || false,
  });

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
      ? `${apiUrl}/api/user/adminUpdateStaff/${_id}`
      : `${apiUrl}/api/hrm/registerStaff`;

    try {
      const res = await fetch(url, {
        method: _id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.message || "An error occurred");
      } else {
        // Optionally display success message here
        router.push("/hrm");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-8 bg-white shadow-lg rounded-lg">
        <h2 className="flex items-center gap-2 justify-center text-2xl font-semibold text-indigo-700 mb-6">
          <HiOutlineUserAdd />
          {_id ? "Edit Staff" : "Register Staff"}
        </h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Number Field */}
          <div>
            <label
              htmlFor="numberStaff"
              className="block text-sm font-medium text-gray-700"
            >
              Staff Number
            </label>
            <input
              type="text"
              id="numberStaff"
              value={formData.numberStaff}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md bg-gray-200 text-gray-500 cursor-not-allowed"
              readOnly
            />
          </div>
          {/* Name Field */}
          <div>
            <label
              htmlFor="nameStaff"
              className="block text-sm font-medium text-gray-700"
            >
              Staff Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nameStaff"
              value={formData.nameStaff}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter staff name"
              required
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="emailStaff"
              className="block text-sm font-medium text-gray-700"
            >
              Staff Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="emailStaff"
              value={formData.emailStaff}
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter staff email"
              required
            />
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="passwordStaff"
              className="block text-sm font-medium text-gray-700"
            >
              Staff Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="passwordStaff"
              onChange={handleInputChange}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter password"
            />
          </div>

          {/* Checkbox Field */}
          <div className="flex items-center gap-2">
            <input
              id="isStaff"
              type="checkbox"
              checked={formData.isStaff}
              onChange={handleInputChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label htmlFor="isStaff" className="text-sm font-medium text-gray-700">
              Is Staff
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading ? "Submitting..." : _id ? "Edit Staff" : "Add Staff"}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {errorMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default FormRegisterStaff;
