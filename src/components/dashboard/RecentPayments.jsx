// components/RecentPayments.js

import React from "react";

const RecentPayments = ({ payments, handleShowMore, showMore }) => {
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
              <th className="py-2 px-4">Code</th>
              <th className="py-2 px-4">Amount</th>
              <th className="py-2 px-4">Order Code</th>
              <th className="py-2 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments?.map((payment) => (
              <tr key={payment._id}>
                <td className="py-2 px-4">{payment.paymentCode}</td>
                <td className="py-2 px-4">${payment.amount}</td>
                <td className="py-2 px-4">{payment.orderCode}</td>
                <td className="py-2 px-4">{payment.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentPayments;
