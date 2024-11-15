"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "./HeroSection";
import RecentOrders from "./RecentOrders";
import RecentPayments from "./RecentPayments";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [totals, setTotals] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    sales: 0,
  });
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [orderCustomer, setOrderCustomer] = useState(null);
  const [paymentsCustomer, setPaymentsCustomer] = useState(null);
  const [showMoreOrders, setShowMoreOrders] = useState(true);
  const [showMorePayments, setShowMorePayments] = useState(true);

  const { currentUser } = useSelector((state) => state.user);
  const { isAdmin, isStaff, isCustomer } = currentUser || {};
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchData = async () => {
        try {
          const [customersRes, productsRes, ordersRes, paymentsRes] =
            await Promise.all([
              fetch(`${apiUrl}/api/customer/getCustomers`, {
                method: "GET",
                credentials: "include",
              }),
              fetch(`${apiUrl}/api/product/getproducts`, {
                method: "GET",
                credentials: "include",
              }),
              fetch(`${apiUrl}/api/order/getorders`, {
                method: "GET",
                credentials: "include",
              }),
              fetch(`${apiUrl}/api/payments/get`, {
                method: "GET",
                credentials: "include",
              }),
            ]);

          const customersData = await customersRes.json();
          const productsData = await productsRes.json();
          const ordersData = await ordersRes.json();
          const paymentsData = await paymentsRes.json();

          if (customersRes.ok)
            setTotals((prev) => ({
              ...prev,
              customers: customersData.totalCustomers,
            }));
          if (productsRes.ok)
            setTotals((prev) => ({
              ...prev,
              products: productsData.totalProducts,
            }));
          if (ordersRes.ok) {
            setOrders(ordersData.orders);
            setTotals((prev) => ({ ...prev, orders: ordersData.totalOrders }));
            if (ordersData.orders.length < 9) setShowMoreOrders(false);
          }
          if (paymentsRes.ok) {
            setPayments(paymentsData.payments);
            // Assuming you want to calculate total sales from payments
            const totalSales = paymentsData.payments.reduce(
              (acc, payment) => acc + payment.amount,
              0
            );
            setTotals((prev) => ({ ...prev, sales: totalSales }));
            if (paymentsData.payments.length < 9) setShowMorePayments(false);
          }

          if (isCustomer) {
            const ordersCustomerRes = await fetch(
              `${apiUrl}/api/order/getCustomerOrder/${currentUser._id}`,
              { method: "GET", credentials: "include" }
            );
            const ordersCustomerData = await ordersCustomerRes.json();
            if (ordersCustomerRes.ok) setOrderCustomer(ordersCustomerData);

            const paymentsCustomerRes = await fetch(
              `${apiUrl}/api/payments/getPaymentCts/${currentUser._id}`,
              { method: "GET", credentials: "include" }
            );
            const paymentsCustomerData = await paymentsCustomerRes.json();
            if (paymentsCustomerRes.ok)
              setPaymentsCustomer(paymentsCustomerData);
          }
        } catch (error) {
          console.error("Error fetching data: ", error.message);
        }
      };

      fetchData();
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
        if (data.orders.length < 9) setShowMoreOrders(false);
      }
    } catch (error) {
      console.error("Error fetching more orders: ", error.message);
    }
  };

  const handleShowMorePayments = async () => {
    const startIndex = payments.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/payments/get?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setPayments((prev) => [...prev, ...data.payments]);
        if (data.payments.length < 9) setShowMorePayments(false);
      }
    } catch (error) {
      console.error("Error fetching more payments: ", error.message);
    }
  };

  return (
    <main className="p-6 space-y-6 bg-gray-100">
      <HeroSection
        totalCustomers={totals.customers}
        totalOrders={totals.orders}
        totalProducts={totals.products}
        totalSales={totals.sales}
        isStaff={isStaff}
        isAdmin={isAdmin}
      />
      <RecentOrders
        orders={orders}
        ordersCustomer={orderCustomer}
        handleShowMore={handleShowMoreOrders}
        showMore={showMoreOrders}
        isAdmin={isAdmin}
        isStaff={isStaff}
        isCustomer={isCustomer}
      />
      <RecentPayments
        payments={payments}
        paymentsCustomer={paymentsCustomer}
        handleShowMorePayments={handleShowMorePayments}
        showMorePayments={showMorePayments}
        isAdmin={isAdmin}
        isStaff={isStaff}
        isCustomer={isCustomer}
      />
    </main>
  );
};

export default Dashboard;
