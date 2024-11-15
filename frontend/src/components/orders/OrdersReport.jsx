// OrdersReport.js
"use client";

import React, { useEffect, useState } from "react";
import RecentOrders from "../dashboard/RecentOrders";
import { useSelector } from "react-redux";

const OrdersReport = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [ordersCustomer, setOrdersCustomer] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showMoreOrders, setShowMoreOrders] = useState(true);

  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const isCustomer = currentUser?.isCustomer;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchOrders = async () => {
        try {
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
            if (ordersData.orders.length < 9) {
              setShowMoreOrders(false);
            }
          } else {
            console.error(ordersData.message);
          }

          if (customerOrdersRes.ok) {
            setOrdersCustomer(customerOrdersData);
          } else {
            console.error(customerOrdersData.message);
          }
        } catch (error) {
          console.error("Error fetching orders: ", error.message);
        }
      };

      fetchOrders();
    }
  }, [currentUser]);

  const handleShowMoreOrders = async () => {
    const startIndex = orders.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/order/getorders?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setOrders((prev) => [...prev, ...data.orders]);
        if (data.orders.length < 9) {
          setShowMoreOrders(false);
        }
      }
    } catch (error) {
      console.error("Error fetching more orders: ", error.message);
    }
  };

  return (
    <RecentOrders
      orders={orders}
      ordersCustomer={ordersCustomer}
      handleShowMore={handleShowMoreOrders}
      showMore={showMoreOrders}
      isAdmin={isAdmin}
      isStaff={isStaff}
      isCustomer={isCustomer}
    />
  );
};

export default OrdersReport;
