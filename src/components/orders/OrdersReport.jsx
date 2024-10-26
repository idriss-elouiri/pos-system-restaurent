"use client"

import React, { useEffect, useState } from "react";
import RecentOrders from "../dashboard/RecentOrders";

const OrdersReport = () => {
    const [orders, setOrders] = useState([]);
    const [showMoreOrders, setShowMoreOrders] = useState(true);
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
          setTotalOrders(data.totalorders);
          if (data.orders.length < 9) {
            setShowMoreOrders(false);
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
  const handleShowMoreOrders = async () => {
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
          setShowMoreOrders(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return <RecentOrders orders={orders} handleShowMore={handleShowMoreOrders} showMore={showMoreOrders} />
};

export default OrdersReport;
