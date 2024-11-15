"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle, HiPencilAlt } from "react-icons/hi";
import { FaTrash, FaRegUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const CustomerComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [customers, setCustomers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [customerIdToDelete, setCustomerIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchCustomers = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
          const res = await fetch(`${apiUrl}/api/customer/getCustomers`, {
            method: "GET",
            credentials: "include",
          });
          const data = await res.json();
          if (res.ok) {
            setCustomers(data.customers);
            setShowMore(data.customers.length >= 9);
          } else {
            setErrorMessage(data.message || "Failed to fetch customers.");
          }
        } catch (error) {
          setErrorMessage(error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = customers.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/customer/getCustomer?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setCustomers((prev) => [...prev, ...data.customers]);
        setShowMore(data.customers.length >= 9);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/user/adminDeleteCustomer/${customerIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setCustomers((prev) =>
          prev.filter((customer) => customer._id !== customerIdToDelete)
        );
        setShowModal(false);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleEditClick = (id) => {
    router.push(`/customers/${id}/editCustomer`);
  };

  return (
    <div className="w-full px-4 md:px-10 lg:px-20 py-8 bg-gray-50">
      <div className="flex justify-between items-center w-full h-full">
        <Link
          href="/customers/newCustomer"
          className="flex items-center gap-2 p-2 border-2 font-semibold border-green-600 rounded text-green-600 mb-4"
        >
          <FaRegUser />
          <span>Add New Customer</span>
        </Link>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            See All Orders
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : errorMessage ? (
        <p className="text-red-600">{errorMessage}</p>
      ) : isAdmin || isStaff ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border bg-white shadow-md rounded-lg text-center">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">NAME</th>
                <th className="px-4 py-2">CUSTOMER PHONE NUMBER</th>
                <th className="px-4 py-2">EMAIL</th>
                <th className="px-4 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id} className="border-b last:border-none">
                  <td className="px-4 py-3">{customer.nameCustomer}</td>
                  <td className="px-4 py-3">{customer.phoneNumberCustomer}</td>
                  <td className="px-4 py-3">{customer.emailCustomer}</td>
                  <td className="px-4 py-3 flex justify-center space-x-2">
                    <button
                      onClick={() => handleEditClick(customer._id)}
                      aria-label={`Edit ${customer.nameCustomer}`}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                      <HiPencilAlt /> <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setCustomerIdToDelete(customer._id);
                      }}
                      aria-label={`Delete ${customer.nameCustomer}`}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <FaTrash /> <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-4">
          You have no customers yet!
        </p>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-md text-center">
            <HiOutlineExclamationCircle className="w-14 h-14 mx-auto text-gray-400 mb-4" />
            <h3 className="mb-5 text-lg text-gray-600">
              Are you sure you want to delete this customer?
            </h3>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleDeleteCustomer}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, I'm sure
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                No, cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerComp;
