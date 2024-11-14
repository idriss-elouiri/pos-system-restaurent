"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const PaymentsReport = () => {
  const [payments, setPayments] = useState([]);
  const [paymentsCustomer, setPaymentsCustomer] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isStaff = currentUser?.isStaff;
  const isCustomer = currentUser?.isCustomer;

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}/api/payments/get`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setPayments(data.payments);
          if (data.payments.length < 9) {
            setShowMore(false);
          }
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [apiUrl]);

  useEffect(() => {
    const fetchPaymentsCustomer = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/api/payments/getPaymentCts/${currentUser._id}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();
        if (res.ok) {
          setPaymentsCustomer(data);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    if (isCustomer) {
      fetchPaymentsCustomer();
    }
  }, [apiUrl, currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = payments.length;
    try {
      const res = await fetch(
        `${apiUrl}/api/payments/get?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setPayments((prev) => [...prev, ...data.payments]);
        if (data.payments.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <section className="my-6 bg-white p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center w-full h-full">
        <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
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
        {(isAdmin || isStaff) && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Payment Code</th>
                <th className="py-2 px-4">Payment Method</th>
                <th className="py-2 px-4">Order Code</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Date Paid</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="py-2 px-4">{payment.paymentCode}</td>
                  <td className="py-2 px-4">{payment.paymentMethod}</td>
                  <td className="py-2 px-4">{payment.orderCode}</td>
                  <td className="py-2 px-4">${payment.amount}</td>
                  <td className="py-2 px-4">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {isCustomer && (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Payment Code</th>
                <th className="py-2 px-4">Payment Method</th>
                <th className="py-2 px-4">Order Code</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">Date Paid</th>
              </tr>
            </thead>
            <tbody>
              {paymentsCustomer.map((payment) => (
                <tr key={payment._id}>
                  <td className="py-2 px-4">{payment.paymentCode}</td>
                  <td className="py-2 px-4">{payment.paymentMethod}</td>
                  <td className="py-2 px-4">{payment.orderCode}</td>
                  <td className="py-2 px-4">${payment.amount}</td>
                  <td className="py-2 px-4">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default PaymentsReport;
