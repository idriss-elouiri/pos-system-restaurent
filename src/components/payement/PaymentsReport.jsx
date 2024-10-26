"use client";

import React, { useEffect, useState } from "react";

const PaymentsReport = () => {
  const [payments, setPayments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
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
            setShowMore(false);
          }
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchpayements();
  }, []);

  const handleShowMore = async () => {
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
                <td className="py-2 px-4">{payment.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PaymentsReport;
