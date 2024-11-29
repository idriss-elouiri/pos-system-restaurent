"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaPaypal, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const Payment = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [ordersCustomer, setOrdersCustomer] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [orderIdToDelete, setOrderIdToDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const isCustomer = currentUser?.isCustomer;
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchOrders = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
          const res = await fetch(`${apiUrl}/api/order/getorders`, {
            method: "GET",
            credentials: "include",
          });
          const { orders: fetchedOrders } = await res.json();
          if (res.ok) {
            setOrders(fetchedOrders);
            setShowMore(fetchedOrders.length >= 9);
          } else {
            setErrorMessage("Failed to fetch orders.");
          }
        } catch (error) {
          setErrorMessage("An error occurred while fetching orders.");
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    }
  }, [currentUser._id]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchOrdersCustomer = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
          const res = await fetch(
            `${apiUrl}/api/order/getCustomerOrder/${currentUser._id}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await res.json();
          if (res.ok) {
            setOrdersCustomer(data);
          } else {
            setErrorMessage("Failed to fetch customer orders.");
          }
        } catch (error) {
          setErrorMessage("An error occurred while fetching customer orders.");
        } finally {
          setLoading(false);
        }
      };

      if (isCustomer) {
        fetchOrdersCustomer();
      }
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = orders.length;
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/api/order/getorders?startIndex=${startIndex}`
      );
      const { orders: fetchedOrders } = await res.json();
      if (res.ok) {
        setOrders((prev) => [...prev, ...fetchedOrders]);
        setShowMore(fetchedOrders.length >= 9);
      }
    } catch (error) {
      console.error("Error loading more orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/api/order/deleteorder/${orderIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setOrders((prev) =>
          prev.filter((order) => order._id !== orderIdToDelete)
        );
        setShowModal(false);
      } else {
        setErrorMessage("Failed to delete the order.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while deleting the order.");
    } finally {
      setLoading(false);
    }
  };

  const handlePayOrder = (id) => {
    router.push(`/payements/${id}/payementForm`);
  };

  return (
    <div className="p-4 max-w-full mx-auto">
      <Link
        href={"/orders"}
        className="p-2 border-2 font-semibold my-3 border-green-600 rounded text-green-600 flex justify-center items-center w-fit"
      >
        +<p>اعمل طلب جديد</p>
      </Link>
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {(isAdmin || isStaff) && (
        <>
          <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">كود الطلب</th>
                <th className="px-4 py-2 text-left">اسم الزبون</th>
                <th className="px-4 py-2 text-left">اسم البضاعة</th>
                <th className="px-4 py-2 text-left">السعر الاجمالي</th>
                <th className="px-4 py-2 text-left">تاريخ الطلب</th>
                <th className="px-4 py-2 text-left">الحركات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order._id} className="bg-white">
                  <td className="px-4 py-2">{order.orderCode}</td>
                  <td className="px-4 py-2">{order.customerName}</td>
                  <td className="px-4 py-2">{order.productName}</td>
                  <td className="px-4 py-2">
                    ${(order?.productQty * order?.productPrice).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{order.createdAt}</td>
                  <td className="flex justify-center items-center gap-3 px-4 py-2">
                    <button
                      className="flex items-center gap-2 bg-green-600 text-white rounded px-3 py-1 hover:bg-green-700"
                      onClick={() => handlePayOrder(order._id)}
                    >
                      <FaPaypal /> ادفع الطلب
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setOrderIdToDelete(order._id);
                      }}
                      className="flex items-center gap-2 bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700"
                    >
                      <FaTrash /> حذف الطلب
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-4"
            >
              {loading ? "Loading..." : "Show More"}
            </button>
          )}
        </>
      )}
      {isCustomer && (
        <>
          <table className="min-w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left">CODE</th>
                <th className="px-4 py-2 text-left">CUSTOMER</th>
                <th className="px-4 py-2 text-left">PRODUCT</th>
                <th className="px-4 py-2 text-left">TOTAL PRICE</th>
                <th className="px-4 py-2 text-left">DATE</th>
                <th className="px-4 py-2 text-left">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ordersCustomer.map((orderCustomer) => (
                <tr key={orderCustomer._id} className="bg-white">
                  <td className="px-4 py-2">{orderCustomer.orderCode}</td>
                  <td className="px-4 py-2">{orderCustomer.customerName}</td>
                  <td className="px-4 py-2">{orderCustomer.productName}</td>
                  <td className="px-4 py-2">
                    ${orderCustomer.productPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{orderCustomer.createdAt}</td>
                  <td className="flex justify-center items-center gap-3 px-4 py-2">
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setOrderIdToDelete(orderCustomer._id);
                      }}
                      className="flex items-center gap-2 bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700"
                    >
                      <FaTrash /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {showModal && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-5">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this order?</p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDeleteOrder}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
