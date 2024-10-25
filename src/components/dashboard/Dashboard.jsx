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
          setTotalOrders(data.totalorders);
          setOrders(data.orders);
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
          setPayments(data);
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
  return (
    <main className="p-6 space-y-6 bg-gray-100">
      <HeroSection totalCustomers={totalCustomers} totalOrders={totalOrders} totalProducts={totalProducts}  />
      <RecentOrders orders={orders} />
      <RecentPayments payments={payments} />
    </main>
  );
};

export default Dashboard;
