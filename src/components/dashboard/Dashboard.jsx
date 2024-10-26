// Dashboard.js
"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import RecentOrders from "./RecentOrders";
import RecentPayments from "./RecentPayments";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [sales, setSales] = useState(0);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [showMoreOrders, setShowMoreOrders] = useState(true);
  const [showMorePayments, setShowMorePayments] = useState(true);
  const { currentUser } = useSelector((state) => state.user);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchcustomers = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/customer/getCustomers`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setTotalCustomers(data.totalCustomers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchproducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/product/getproducts`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setTotalProducts(data.totalProducts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
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
    const fetchpayements = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/payments/get`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
            setPayments(data.payements);
            if (data.payements.length < 9) {
              setShowMorePayments(false);
            }
          } else {
            console.log(data.message);
          }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchcustomers();
    fetchproducts();
    fetchorders();
    fetchpayements();
  }, [currentUser._id]);

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
  const handleShowMorePayements = async () => {
    const startIndex = payments.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/payments/get?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setPayments((prev) => [...prev, ...data.payements]);
        setPayments((prev) => [...prev, ...data.payements]);
        if (data.orders.length < 9) {
          setShowMorePayments(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <main className="p-6 space-y-6 bg-gray-100">
      <HeroSection totalCustomers={totalCustomers} totalOrders={totalOrders} totalProducts={totalProducts}  />
      <RecentOrders orders={orders} handleShowMore={handleShowMoreOrders} showMore={showMoreOrders} />
      <RecentPayments payments={payments} handleShowMore={handleShowMorePayements} showMore={showMorePayments}  />
    </main>
  );
};

export default Dashboard;
