"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

const ReceiptComp = () => {
  const [orders, setOrders] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchorders = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/order/getorders`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
          if (data.orders.length < 9) {
            setShowMore(false);
          }
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchorders();
  }, []);

  const handleShowMore = async () => {
    const startIndex = orders.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/order/getorders?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => [...prev, ...data.orders]);
        setOrders((prev) => [...prev, ...data.orders]);
        if (data.orders.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <section className="my-6 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center w-full h-full">
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            See All Orders
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Code</th>
              <th className="py-2 px-4">Customer</th>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Price</th>
              <th className="py-2 px-4">Qty</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2 px-4">{order.orderCode}</td>
                <td className="py-2 px-4">{order.customerName}</td>
                <td className="py-2 px-4">{order.productName}</td>
                <td className="py-2 px-4">${order.productPrice}</td>
                <td className="py-2 px-4">{order.productQty}</td>
                <td className="py-2 px-4">${order.productPrice}</td>
                <td className="py-2 px-4">
                  {order.isPaid ? (
                    <span className="p-2 rounded bg-green-500 text-white">
                      Paid
                    </span>
                  ) : (
                    <span className="p-2 rounded bg-red-500 text-white">
                      Not Paid
                    </span>
                  )}
                </td>
                <td className="py-2 px-4">{order.createdAt}</td>
                <td>
                  <Link href={`/receipts/${order._id}/print`}>
                    <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300">
                    Print Receipt
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ReceiptComp;
