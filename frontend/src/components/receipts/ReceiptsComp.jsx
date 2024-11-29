"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const OrdersTable = ({ orders }) => {
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4">كود الطلب</th>
          <th className="py-2 px-4">اسم الزبون</th>
          <th className="py-2 px-4">اسم البضاعة</th>
          <th className="py-2 px-4">سعر البضاعة</th>
          <th className="py-2 px-4">كمية البضاعة</th>
          <th className="py-2 px-4">السعر الاجمالي</th>
          <th className="py-2 px-4">الحالة</th>
          <th className="py-2 px-4">التاريخ</th>
          <th className="py-2 px-4">الطباعة</th>
        </tr>
      </thead>
      <tbody>
        {orders?.map((order) => (
          <tr key={order._id}>
            <td className="py-2 px-4">{order.orderCode}</td>
            <td className="py-2 px-4">{order.customerName}</td>
            <td className="py-2 px-4">{order.productName}</td>
            <td className="py-2 px-4">${order.productPrice}</td>
            <td className="py-2 px-4">{order.productQty}</td>
            <td className="py-2 px-4">
              ${(order.productQty * order.productPrice).toFixed(2)}
            </td>
            <td className="py-2 px-4">
              <span
                className={`p-2 rounded ${
                  order.isPaid ? "bg-green-500" : "bg-red-500"
                } text-white`}
              >
                {order.isPaid ? "Paid" : "Not Paid"}
              </span>
            </td>
            <td className="py-2 px-4">
              {new Date(order.createdAt).toLocaleDateString()}
            </td>
            <td>
              <Link href={`/receipts/${order._id}/print`}>
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-300">
                  طباعة التوصيل
                </button>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const ReceiptComp = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [ordersCustomer, setOrdersCustomer] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const isCustomer = currentUser?.isCustomer;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const [ordersRes, customerOrdersRes] = await Promise.all([
          fetch(`${apiUrl}/api/order/getorders`, {
            method: "GET",
            credentials: "include",
          }),
          fetch(`${apiUrl}/api/order/getCustomerOrder/${currentUser._id}`, {
            method: "GET",
            credentials: "include",
          }),
        ]);

        const ordersData = await ordersRes.json();
        const customerOrdersData = await customerOrdersRes.json();

        if (ordersRes.ok) {
          setOrders(ordersData.orders);
          setShowMore(ordersData.orders.length >= 9);
        }
        if (customerOrdersRes.ok) {
          setOrdersCustomer(customerOrdersData);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const handleShowMore = async () => {
    const startIndex = orders.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/order/getorders?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => [...prev, ...data.orders]);
        setShowMore(data.orders.length >= 9);
      }
    } catch (error) {
      console.error("Error loading more orders:", error);
    }
  };

  if (loading) return <p>تحميل...</p>;

  return (
    <section className="my-6 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center w-full h-full">
        <h2 className="text-xl font-semibold mb-4">الطلبات الأخيرة</h2>
        {showMore && (
          <button
            onClick={handleShowMore}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            انظر لجميع الطلبات
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        {(isAdmin || isStaff) && <OrdersTable orders={orders} />}
        {isCustomer && <OrdersTable orders={ordersCustomer} />}
      </div>
    </section>
  );
};

export default ReceiptComp;
